import { AppDataSource } from '@config/data-source';
import { Internship } from '@entities/Internship';
import { createCrudService } from '@services/generic.service';
import { ApiError } from '@utils/ApiError';
import { deleteUpload, persistUpload } from '@utils/storage';

const repository = () => AppDataSource.getRepository(Internship);
const base = createCrudService<Internship>(AppDataSource.getRepository(Internship));

export const internshipService = {
  ...base,

  async updateCertificateImage(id: string, localFilePath: string): Promise<Internship> {
    const internship = await repository().findOne({ where: { id } });
    if (!internship) throw ApiError.notFound('Internship not found');

    const url = await persistUpload(localFilePath, 'internships');
    if (internship.certificateImage) await deleteUpload(internship.certificateImage);
    internship.certificateImage = url;
    return await repository().save(internship);
  },
};
