import { AppDataSource } from '@config/data-source';
import { Setting } from '@entities/Setting';
import { UpdateSettingInput } from '@validations/setting.validation';
import { deleteUpload, persistUpload } from '@utils/storage';

const repository = () => AppDataSource.getRepository(Setting);

export const settingService = {
  async get(): Promise<Setting> {
    let setting = await repository().findOne({ where: {} });
    if (!setting) {
      setting = await repository().save(repository().create());
    }
    return setting;
  },

  async update(input: UpdateSettingInput): Promise<Setting> {
    const setting = await this.get();
    repository().merge(setting, input as Partial<Setting>);
    return await repository().save(setting);
  },

  async updateFavicon(localFilePath: string): Promise<Setting> {
    const setting = await this.get();
    const url = await persistUpload(localFilePath, 'settings');
    if (setting.favicon) await deleteUpload(setting.favicon);
    setting.favicon = url;
    return await repository().save(setting);
  },

  async updateOgImage(localFilePath: string): Promise<Setting> {
    const setting = await this.get();
    const url = await persistUpload(localFilePath, 'settings');
    if (setting.ogImage) await deleteUpload(setting.ogImage);
    setting.ogImage = url;
    return await repository().save(setting);
  },
};
