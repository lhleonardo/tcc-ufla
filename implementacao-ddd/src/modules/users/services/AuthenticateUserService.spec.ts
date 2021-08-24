import FakeUsersRepository from '../repositories/fake/FakeUsersRepository';
import CreateUserService from './CreateUserService';
import AuthenticateUserService from './AuthenticateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

let fakeRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;
let authUser: AuthenticateUserService;
let createUser: CreateUserService;

describe('AuthenticationUser', () => {
  beforeEach(() => {
    fakeCacheProvider = new FakeCacheProvider();
    fakeRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    authUser = new AuthenticateUserService(fakeRepository, fakeHashProvider);
    createUser = new CreateUserService(
      fakeRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );
  });

  it('Deve autenticar um usuário', async () => {
    await createUser.execute({
      name: 'Leonardo Henrique de Braz',
      email: 'lhleonardo@hotmail.com',
      password: '123456',
    });

    const user = await authUser.execute({
      email: 'lhleonardo@hotmail.com',
      password: '123456',
    });

    expect(user).toHaveProperty('token');
  });

  it('Não deve se autenticar com usuário não cadastrado', async () => {
    await expect(
      authUser.execute({ email: 'lhleonardo@hotmail.com', password: '123456' }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('Não deve se autenticar com credenciais inválidas', async () => {
    await createUser.execute({
      name: 'Leonardo Henrique de Braz',
      email: 'lhleonardo@hotmail.com',
      password: '123456',
    });

    await expect(
      authUser.execute({
        email: 'lhleonardo@hotmail.com',
        password: '12345',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
