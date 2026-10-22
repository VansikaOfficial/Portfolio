import { AppDataSource } from '@config/data-source';
import { Gallery } from '@entities/Gallery';
import { CreateGalleryInput, UpdateGalleryInput } from '@validations/gallery.validation';
import { ApiError } from '@utils/ApiError';
import { deleteUpload, persistUpload } from '@utils/storage';

const repository = () => AppDataSource.getRepository(Gallery);

export const galleryService = {
  async findAll(): Promise<Gallery[]> {
    return repository().find({ order: { displayOrder: 'ASC' } });
  },

  async findById(id: string): Promise<Gallery> {
    const item = await repository().findOne({ where: { id } });
    if (!item) throw ApiError.notFound('Gallery item not found');
    return item;
  },

  async create(input: CreateGalleryInput, localFilePath: string): Promise<Gallery> {
    const image = await persistUpload(localFilePath, 'gallery');
    const item = repository().create({ ...input, image } as Partial<Gallery>);
    return await repository().save(item);
  },

  async update(id: string, input: UpdateGalleryInput): Promise<Gallery> {
    const item = await this.findById(id);
    repository().merge(item, input as Partial<Gallery>);
    return await repository().save(item);
  },

  async remove(id: string): Promise<void> {
    const item = await this.findById(id);
    await deleteUpload(item.image);
    await repository().remove(item);
  },
};
