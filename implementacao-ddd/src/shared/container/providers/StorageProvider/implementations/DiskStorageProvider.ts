import fs from 'fs';
import path from 'path';
import config from '@config/upload';
import IStorageProvider from '../models/IStorageProvider';

export default class DiskStorageProvider implements IStorageProvider {
  async uploadFile(file: string): Promise<string> {
    await fs.promises.rename(
      path.resolve(config.tmpFolder, file),
      path.resolve(config.uploadFolder, file),
    );

    return file;
  }
  async deleteFile(file: string): Promise<void> {
    const filePath = path.resolve(config.uploadFolder, file);

    try {
      await fs.promises.stat(filePath);
      await fs.promises.unlink(filePath);
    } catch {}
  }
}
