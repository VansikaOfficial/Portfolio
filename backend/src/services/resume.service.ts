import path from 'path';
import { AppDataSource } from '@config/data-source';
import { Resume } from '@entities/Resume';
import { deleteUpload, persistUpload } from '@utils/storage';

const repository = () => AppDataSource.getRepository(Resume);

export const resumeService = {
  async get(): Promise<Resume> {
    let resume = await repository().findOne({ where: {} });
    if (!resume) {
      resume = await repository().save(repository().create());
    }
    return resume;
  },

  async upload(localFilePath: string, originalName: string): Promise<Resume> {
    const resume = await this.get();
    const url = await persistUpload(localFilePath, 'resume');
    if (resume.filePath) await deleteUpload(resume.filePath);

    resume.filePath = url;
    resume.originalName = originalName;
    resume.version = new Date().toISOString().slice(0, 10);

    return await repository().save(resume);
  },

  async remove(): Promise<Resume> {
    const resume = await this.get();
    if (resume.filePath) await deleteUpload(resume.filePath);
    resume.filePath = null;
    resume.originalName = null;
    return await repository().save(resume);
  },
};

// Helper exported for the controller to build a safe download filename
export const buildDownloadName = (originalName: string | null): string => {
  if (!originalName) return 'resume.pdf';
  const ext = path.extname(originalName) || '.pdf';
  return `resume${ext}`;
};
