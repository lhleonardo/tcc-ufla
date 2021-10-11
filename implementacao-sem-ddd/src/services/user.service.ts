import AppError from '@errors/AppError';
import User from '@models/User';
import ICacheProvider from '@providers/cache/ICacheProvider';
import IHashProvider from '@providers/hash/IHashProvider';
import ICreateUserDTO from '@repositories/dtos/ICreateUserDTO';
import IUpdateUserDTO from '@repositories/dtos/IUpdateUserDTO';
import IUserRepository from '@repositories/IUserRepository';
import { classToClass } from 'class-transformer';
import { inject, injectable } from 'tsyringe';

@injectable()
class UserService {
  constructor(
    @inject('UserRepository') private userRepository: IUserRepository,
    @inject('HashProvider') private hash: IHashProvider,
    @inject('CacheProvider') private cacheProvider: ICacheProvider,
  ) {}

  public async createUser({
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

  public async get(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError('Usuário inexistente');
    }

    return classToClass(user);
  }

  public async update(
    userId: string,
    { name, email, oldPassword, password }: IUpdateUserDTO,
  ): Promise<User> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError('Usuário não encontrado.');
    }
    // nome sempre vai ser atualizado
    user.name = name;

    // verifica se e-mail é válido
    const findEmail = await this.userRepository.findByEmail(email);

    // e-mail já está em uso por outro usuário no sistema
    if (findEmail && findEmail.id !== userId) {
      throw new AppError('Esse e-mail já está sendo utilizado.');
    }
    user.email = email;

    if (password && !oldPassword) {
      throw new AppError('Confirmação de senha é necessária para mudança.');
    }

    if (password && oldPassword) {
      const validOldPassword = await this.hash.compare(
        oldPassword,
        user.password,
      );

      if (!validOldPassword) {
        throw new AppError('Senha antiga não coincide com a senha atual');
      }

      user.password = await this.hash.generateHash(password);
    }

    return this.userRepository.save(user);
  }
}

export default UserService;
