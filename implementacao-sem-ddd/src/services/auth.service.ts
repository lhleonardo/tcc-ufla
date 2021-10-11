import config from '@config/auth';
import AppError from '@errors/AppError';
import User from '@models/User';
import IHashProvider from '@providers/hash/IHashProvider';
import IMailProvider from '@providers/mail/IMailProvider';
import IUserRepository from '@repositories/IUserRepository';
import IUserTokenRepository from '@repositories/IUserTokenRepository';
import { classToClass } from 'class-transformer';
import { addHours, isAfter } from 'date-fns';
import { sign } from 'jsonwebtoken';
import path from 'path';
import { inject, injectable } from 'tsyringe';

type ILoginParams = {
  email: string;
  password: string;
};

type ILoginSuccess = {
  user: User;
  token: string;
};

type IForgotPassword = {
  email: string;
};

type IResetPassword = {
  token: string;
  password: string;
};

@injectable()
class AuthService {
  constructor(
    @inject('UserRepository') private userRepository: IUserRepository,
    @inject('HashProvider') private hash: IHashProvider,
    @inject('MailProvider') private mailService: IMailProvider,
    @inject('UserTokenRepository')
    private userTokenRepository: IUserTokenRepository,
  ) {}

  public async login({
    email,
    password,
  }: ILoginParams): Promise<ILoginSuccess> {
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

  public async forgotPassword({ email }: IForgotPassword): Promise<void> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new AppError(`O e-mail ${email} não está cadastrado na aplicação`);
    }

    const { token } = await this.userTokenRepository.generate(user.id);

    await this.mailService.sendMail({
      subject: 'Redefinição de senha',
      to: { name: user.name, email: user.email },
      template: {
        file: path.resolve(
          __dirname,
          '..',
          'views',
          'forgot_password_template.hbs',
        ),
        variables: {
          name: user.name,
          link: `${process.env.APP_WEB_URL}/reset-password?token=${token}`,
          email: user.email,
        },
      },
    });
  }

  public async resetPassword({
    token,
    password,
  }: IResetPassword): Promise<void> {
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

    user.password = await this.hash.generateHash(password);

    await this.userRepository.save(user);
  }
}

export default AuthService;
