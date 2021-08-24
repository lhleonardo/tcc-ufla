import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import IUpdateUserDTO from '../dtos/IUpdateUserDTO';
import User from '../infra/typeorm/entities/User';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUserRepository from '../repositories/IUserRepository';

@injectable()
class UpdateUserService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}
  public async execute(
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
      const validOldPassword = await this.hashProvider.compare(
        oldPassword,
        user.password,
      );

      if (!validOldPassword) {
        throw new AppError('Senha antiga não coincide com a senha atual');
      }

      user.password = await this.hashProvider.generateHash(password);
    }

    return this.userRepository.save(user);
  }
}

export default UpdateUserService;
