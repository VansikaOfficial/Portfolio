import { AppDataSource } from '@config/data-source';
import { Testimonial } from '@entities/Testimonial';
import { createCrudService } from '@services/generic.service';
import { ApiError } from '@utils/ApiError';
import { deleteUpload, persistUpload } from '@utils/storage';

const repository = () => AppDataSource.getRepository(Testimonial);
const base = createCrudService<Testimonial>(AppDataSource.getRepository(Testimonial));

export const testimonialService = {
  ...base,

  async updateAvatar(id: string, localFilePath: string): Promise<Testimonial> {
    const testimonial = await repository().findOne({ where: { id } });
    if (!testimonial) throw ApiError.notFound('Testimonial not found');

    const url = await persistUpload(localFilePath, 'testimonials');
    if (testimonial.avatar) await deleteUpload(testimonial.avatar);
    testimonial.avatar = url;
    return await repository().save(testimonial);
  },
};
