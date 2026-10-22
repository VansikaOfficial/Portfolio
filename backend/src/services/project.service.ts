import { AppDataSource } from '@config/data-source';
import { Project } from '@entities/Project';
import { CreateProjectInput, UpdateProjectInput } from '@validations/project.validation';
import { ApiError } from '@utils/ApiError';
import { deleteUpload, persistUpload } from '@utils/storage';

const repository = () => AppDataSource.getRepository(Project);

const slugify = (text: string): string =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

const generateUniqueSlug = async (title: string, excludeId?: string): Promise<string> => {
  const base = slugify(title);
  let slug = base;
  let counter = 1;

  while (true) {
    const existing = await repository()
      .createQueryBuilder('project')
      .where('project.slug = :slug', { slug })
      .andWhere(excludeId ? 'project.id != :excludeId' : '1=1', { excludeId })
      .getOne();

    if (!existing) return slug;
    slug = `${base}-${counter}`;
    counter += 1;
  }
};

export const projectService = {
  async findAll(filters: { featured?: boolean; status?: string } = {}) {
    const qb = repository().createQueryBuilder('project').orderBy('project.displayOrder', 'ASC');
    if (filters.featured !== undefined) {
      qb.andWhere('project.featured = :featured', { featured: filters.featured });
    }
    if (filters.status) {
      qb.andWhere('project.status = :status', { status: filters.status });
    }
    return qb.getMany();
  },

  async findById(id: string): Promise<Project> {
    const project = await repository().findOne({ where: { id } });
    if (!project) throw ApiError.notFound('Project not found');
    return project;
  },

  async findBySlug(slug: string): Promise<Project> {
    const project = await repository().findOne({ where: { slug } });
    if (!project) throw ApiError.notFound('Project not found');
    return project;
  },

  async create(input: CreateProjectInput): Promise<Project> {
    const slug = await generateUniqueSlug(input.title);
    const project = repository().create({ ...input, slug } as Partial<Project>);
    return await repository().save(project);
  },

  async update(id: string, input: UpdateProjectInput): Promise<Project> {
    const project = await this.findById(id);
    let slug = project.slug;
    if (input.title && input.title !== project.title) {
      slug = await generateUniqueSlug(input.title, id);
    }
    repository().merge(project, { ...input, slug } as Partial<Project>);
    return await repository().save(project);
  },

  async remove(id: string): Promise<void> {
    const project = await this.findById(id);
    if (project.thumbnail) await deleteUpload(project.thumbnail);
    await Promise.all((project.images || []).map((img) => deleteUpload(img)));
    await repository().remove(project);
  },

  async updateThumbnail(id: string, localFilePath: string): Promise<Project> {
    const project = await this.findById(id);
    const url = await persistUpload(localFilePath, 'projects/thumbnails');
    if (project.thumbnail) await deleteUpload(project.thumbnail);
    project.thumbnail = url;
    return await repository().save(project);
  },

  async addImages(id: string, localFilePaths: string[]): Promise<Project> {
    const project = await this.findById(id);
    const urls = await Promise.all(localFilePaths.map((p) => persistUpload(p, 'projects/gallery')));
    project.images = [...(project.images || []), ...urls];
    return await repository().save(project);
  },

  async removeImage(id: string, imageUrl: string): Promise<Project> {
    const project = await this.findById(id);
    project.images = (project.images || []).filter((img) => img !== imageUrl);
    await deleteUpload(imageUrl);
    return await repository().save(project);
  },
};
