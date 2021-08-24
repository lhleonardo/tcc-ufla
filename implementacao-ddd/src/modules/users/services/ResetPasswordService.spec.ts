import FakeUsersRepository from '../repositories/fake/FakeUsersRepository';
import FakeUserTokenRepository from '../repositories/fake/FakeUserTokenRepository';
import ResetPasswordService from './ResetPasswordService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';

let fakeUserRepository: FakeUsersRepository;
let fakeUserTokenRepository: FakeUserTokenRepository;
let fakeHashProvider: FakeHashProvider;
let resetPassword: ResetPasswordService;

describe('Reset Password', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    fakeUserTokenRepository = new FakeUserTokenRepository();
    fakeHashProvider = new FakeHashProvider();
    resetPassword = new ResetPasswordService(
      fakeUserRepository,
      fakeUserTokenRepository,
      fakeHashProvider,
    );
  });
  it('Deve redefinir a senha a partir de um token', async () => {
    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');
    const user = await fakeUserRepository.create({
      name: 'Leonardo Braz',
      email: 'lhleonardo@hotmail.com',
      password: '123456',
    });

    const { token } = await fakeUserTokenRepository.generate(user.id);

    await resetPassword.execute({ token, password: '123123' });

    const updatedUser = await fakeUserRepository.findById(user.id);

    expect(updatedUser?.password).toBe('123123');
    expect(generateHash).toHaveBeenCalledWith('123123');
  });

  it('Não deve redefinir a senha com token inválido', async () => {
    await expect(
      resetPassword.execute({
        token: 'blablabla',
        password: 'strong password here',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Não deve redefinir senha de usuário que não existe mais', async () => {
    const resetData = await fakeUserTokenRepository.generate('user id');

    await expect(
      resetPassword.execute({
        token: resetData.token,
        password: 'strong password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Não deve redefinir senha com token expirado', async () => {
    const user = await fakeUserRepository.create({
      name: 'Leonardo Henrique',
      email: 'lhleonardo@hotmail.com',
      password: '123456',
    });

    const { token } = await fakeUserTokenRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const date = new Date();

      return date.setHours(date.getHours() + 3);
    });

    await expect(
      resetPassword.execute({ token, password: '123123' }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
