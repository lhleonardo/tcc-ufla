import AppError from '@errors/AppError';
import IHashProvider from '@providers/hash/IHashProvider';
import FakeMailProvider from '@providers/mail/impl/FakeMailProvider';
import FakeUsersRepository from '@repositories/fakes/FakeUsersRepository';
import FakeUserTokenRepository from '@repositories/fakes/FakeUserTokenRepository';
import AuthService from '@services/auth.service';

let fakeUserRepository: FakeUsersRepository;
let fakeUserTokenRepository: FakeUserTokenRepository;
let fakeMailProvider: FakeMailProvider;
let sendForgotPasswordEmail: AuthService;

describe('Forgot Password', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokenRepository = new FakeUserTokenRepository();

    sendForgotPasswordEmail = new AuthService(
      fakeUserRepository,
      {} as IHashProvider,
      fakeMailProvider,
      fakeUserTokenRepository,
    );
  });

  it('Deve permitir recuperar a senha a partir do e-mail', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');
    await fakeUserRepository.create({
      name: 'Leonardo Henrique de Braz',
      email: 'lhleonardo@hotmail.com',
      password: '123456',
    });

    await sendForgotPasswordEmail.forgotPassword({
      email: 'lhleonardo@hotmail.com',
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it('Não deve permitir recuperar senha de usuário não cadastrado', async () => {
    await expect(
      sendForgotPasswordEmail.forgotPassword({
        email: 'lhleonardo@hotmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Deve criar um token único para recuperação de senha', async () => {
    const generateToken = jest.spyOn(fakeUserTokenRepository, 'generate');

    const user = await fakeUserRepository.create({
      email: 'lhleonardo@hotmail.com',
      name: 'Leonardo Henrique de Braz',
      password: '123456',
    });

    await sendForgotPasswordEmail.forgotPassword({
      email: 'lhleonardo@hotmail.com',
    });

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
