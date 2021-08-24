import { sign } from 'jsonwebtoken';
import config from '@config/auth';
import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';
import IUserRepository from '../repositories/IUserRepository';
import { injectable, inject } from 'tsyringe';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import { classToClass } from 'class-transformer';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
}

@injectable()
export default class AuthenticateUserService {
  constructor(
    @inject('UserRepository') private userRepository: IUserRepository,
    @inject('HashProvider') private hash: IHashProvider,
  ) {}

  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const validUser = await this.userRepository.findByEmail(email);

    if (!validUser) {
      throw new AppError('Bad credentials.', 401);
    }

    const validPassword = await this.hash.compare(password, validUser.password);

    if (!validPassword) {
      throw new AppError('Bad credentials.', 401);
    }
    const token = sign({}, config.jwt.secret, {
      subject: validUser.id,
      expiresIn: config.jwt.expiresIn,
    });
    return {
      user: classToClass(validUser),
      token,
    };
  }
}
