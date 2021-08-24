import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import IUserRepository from '../repositories/IUserRepository';
import { injectable, inject } from 'tsyringe';
import ICreateUserDTO from '../dtos/ICreateUserDTO';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

@injectable()
export default class CreateUserService {
  constructor(
    @inject('UserRepository') private userRepository: IUserRepository,
    @inject('HashProvider') private hash: IHashProvider,
    @inject('CacheProvider') private cacheProvider: ICacheProvider,
  ) {}
  public async execute({
    name,
    email,
    password,
  }: ICreateUserDTO): Promise<User> {
    const checkUserExists = await this.userRepository.findByEmail(email);

    if (checkUserExists) {
      throw new AppError('This e-mail is already being used');
    }

    // hash password
    const hashedPassword = await this.hash.generateHash(password);

    const user = await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await this.cacheProvider.invalidatePrefix('list-providers');

    return user;
  }
}
