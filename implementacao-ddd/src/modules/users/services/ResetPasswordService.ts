import IUserRepository from '../repositories/IUserRepository';
import IUserTokenRepository from '../repositories/IUserTokenRepository';
import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import isAfter from 'date-fns/isAfter';
import addHours from 'date-fns/addHours';

interface IRequest {
  token: string;
  password: string;
}

@injectable()
export default class ResetPasswordService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
    @inject('UserTokenRepository')
    private userTokenRepository: IUserTokenRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ token, password }: IRequest): Promise<void> {
    const registry = await this.userTokenRepository.getByToken(token);

    if (!registry) {
      throw new AppError('Token inválido ou inexistente');
    }

    const user = await this.userRepository.findById(registry.userId);

    if (!user) {
      throw new AppError('Usuário inexistente');
    }

    const limitedTime = addHours(registry.createdAt, 2);

    if (isAfter(Date.now(), limitedTime)) {
      throw new AppError('Token excedeu o tempo máximo para utilização');
    }

    user.password = await this.hashProvider.generateHash(password);

    await this.userRepository.save(user);
  }
}
