import { AppDataSource } from '@config/data-source';
import { About } from '@entities/About';
import { UpdateAboutInput } from '@validations/about.validation';
import { deleteUpload, persistUpload } from '@utils/storage';

const aboutRepository = () => AppDataSource.getRepository(About);

export const aboutService = {
  async get(): Promise<About> {
    let about = await aboutRepository().findOne({ where: {} });
    if (!about) {
      about = await aboutRepository().save(aboutRepository().create());
    }
    return about;
  },

  async update(input: UpdateAboutInput): Promise<About> {
    const about = await this.get();
    aboutRepository().merge(about, input as Partial<About>);
    return await aboutRepository().save(about);
  },

  async updateProfilePhoto(localFilePath: string): Promise<About> {
    const about = await this.get();
    const url = await persistUpload(localFilePath, 'profile');
    if (about.profilePhoto) await deleteUpload(about.profilePhoto);
    about.profilePhoto = url;
    return await aboutRepository().save(about);
  },

  async updateBanner(localFilePath: string): Promise<About> {
    const about = await this.get();
    const url = await persistUpload(localFilePath, 'banner');
    if (about.bannerImage) await deleteUpload(about.bannerImage);
    about.bannerImage = url;
    return await aboutRepository().save(about);
  },
};
