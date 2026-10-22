import { AppDataSource } from '@config/data-source';
import { Blog } from '@entities/Blog';
import { CreateBlogInput, UpdateBlogInput } from '@validations/blog.validation';
import { ApiError } from '@utils/ApiError';
import { deleteUpload, persistUpload } from '@utils/storage';

const repository = () => AppDataSource.getRepository(Blog);

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
      .createQueryBuilder('blog')
      .where('blog.slug = :slug', { slug })
      .andWhere(excludeId ? 'blog.id != :excludeId' : '1=1', { excludeId })
      .getOne();
    if (!existing) return slug;
    slug = `${base}-${counter}`;
    counter += 1;
  }
};

export const blogService = {
  async findAll(publishedOnly: boolean): Promise<Blog[]> {
    const qb = repository().createQueryBuilder('blog').orderBy('blog.createdAt', 'DESC');
    if (publishedOnly) qb.andWhere('blog.published = true');
    return qb.getMany();
  },

  async findById(id: string): Promise<Blog> {
    const blog = await repository().findOne({ where: { id } });
    if (!blog) throw ApiError.notFound('Blog not found');
    return blog;
  },

  async findBySlug(slug: string): Promise<Blog> {
    const blog = await repository().findOne({ where: { slug } });
    if (!blog) throw ApiError.notFound('Blog not found');
    return blog;
  },

  async create(input: CreateBlogInput): Promise<Blog> {
    const slug = await generateUniqueSlug(input.title);
    const blog = repository().create({ ...input, slug } as Partial<Blog>);
    return await repository().save(blog);
  },

  async update(id: string, input: UpdateBlogInput): Promise<Blog> {
    const blog = await this.findById(id);
    let slug = blog.slug;
    if (input.title && input.title !== blog.title) {
      slug = await generateUniqueSlug(input.title, id);
    }
    repository().merge(blog, { ...input, slug } as Partial<Blog>);
    return await repository().save(blog);
  },

  async updateCoverImage(id: string, localFilePath: string): Promise<Blog> {
    const blog = await this.findById(id);
    const url = await persistUpload(localFilePath, 'blogs');
    if (blog.coverImage) await deleteUpload(blog.coverImage);
    blog.coverImage = url;
    return await repository().save(blog);
  },

  async remove(id: string): Promise<void> {
    const blog = await this.findById(id);
    if (blog.coverImage) await deleteUpload(blog.coverImage);
    await repository().remove(blog);
  },
};
