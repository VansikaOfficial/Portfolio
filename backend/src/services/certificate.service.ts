import { AppDataSource } from '@config/data-source';
import { Certificate } from '@entities/Certificate';
import { CreateCertificateInput, UpdateCertificateInput } from '@validations/certificate.validation';
import { ApiError } from '@utils/ApiError';
import { deleteUpload, persistUpload } from '@utils/storage';

const repository = () => AppDataSource.getRepository(Certificate);

export const certificateService = {
  async findAll(): Promise<Certificate[]> {
    return repository().find({ order: { displayOrder: 'ASC' } });
  },

  async findById(id: string): Promise<Certificate> {
    const certificate = await repository().findOne({ where: { id } });
    if (!certificate) throw ApiError.notFound('Certificate not found');
    return certificate;
  },

  async create(input: CreateCertificateInput, localFilePath: string): Promise<Certificate> {
    const image = await persistUpload(localFilePath, 'certificates');
    const certificate = repository().create({ ...input, image } as Partial<Certificate>);
    return await repository().save(certificate);
  },

  async update(id: string, input: UpdateCertificateInput): Promise<Certificate> {
    const certificate = await this.findById(id);
    repository().merge(certificate, input as Partial<Certificate>);
    return await repository().save(certificate);
  },

  async replaceImage(id: string, localFilePath: string): Promise<Certificate> {
    const certificate = await this.findById(id);
    const url = await persistUpload(localFilePath, 'certificates');
    await deleteUpload(certificate.image);
    certificate.image = url;
    return await repository().save(certificate);
  },

  async remove(id: string): Promise<void> {
    const certificate = await this.findById(id);
    await deleteUpload(certificate.image);
    await repository().remove(certificate);
  },
};
