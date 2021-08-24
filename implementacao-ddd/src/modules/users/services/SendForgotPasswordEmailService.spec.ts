import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUsersRepository from '../repositories/fake/FakeUsersRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import AppError from '@shared/errors/AppError';
import FakeUserTokenRepository from '../repositories/fake/FakeUserTokenRepository';

let fakeUserRepository: FakeUsersRepository;
let fakeUserTokenRepository: FakeUserTokenRepository;
let fakeMailProvider: FakeMailProvider;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('Forgot Password', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokenRepository = new FakeUserTokenRepository();

    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeMailProvider,
      fakeUserRepository,
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

    await sendForgotPasswordEmail.execute({ email: 'lhleonardo@hotmail.com' });

    expect(sendMail).toHaveBeenCalled();
  });

  it('Não deve permitir recuperar senha de usuário não cadastrado', async () => {
    await expect(
      sendForgotPasswordEmail.execute({ email: 'lhleonardo@hotmail.com' }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Deve criar um token único para recuperação de senha', async () => {
    const generateToken = jest.spyOn(fakeUserTokenRepository, 'generate');

    const user = await fakeUserRepository.create({
      email: 'lhleonardo@hotmail.com',
      name: 'Leonardo Henrique de Braz',
      password: '123456',
    });

    await sendForgotPasswordEmail.execute({ email: 'lhleonardo@hotmail.com' });

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
