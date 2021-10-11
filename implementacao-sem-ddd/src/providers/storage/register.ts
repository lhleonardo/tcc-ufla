import uploadConfig from '@config/upload';
import { container } from 'tsyringe';
import DiskStorageProvider from './impl/DiskStorageProvider';
import S3StorageProvider from './impl/S3StorageProvider';
import IStorageProvider from './IStorageProvider';

const providers = {
  disk: DiskStorageProvider,
  s3: S3StorageProvider,
};

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  providers[uploadConfig.driver],
);
