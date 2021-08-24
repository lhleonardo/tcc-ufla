import User from '@modules/users/infra/typeorm/entities/User';

import AppError from '@shared/errors/AppError';
import IUserRepository from '../repositories/IUserRepository';
import { injectable, inject } from 'tsyringe';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

interface IRequest {
  userId: string;
  avatarFilename: string;
}

@injectable()
export default class UpdateUserAvatarService {
  constructor(
    @inject('UserRepository') private userRepository: IUserRepository,
    @inject('StorageProvider') private storage: IStorageProvider,
  ) {}

  public async execute({ userId, avatarFilename }: IRequest): Promise<User> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError('Only authenticated users can change avatar', 403);
    }

    // precisa apagar avatar antigo
    if (user.avatar) {
      await this.storage.deleteFile(user.avatar);
    }

    user.avatar = await this.storage.uploadFile(avatarFilename);

    await this.userRepository.save(user);

    return user;
  }
}
