import FakeUsersRepository from '../repositories/fake/FakeUsersRepository';
import CreateUserService from './CreateUserService';
import ICreateUserDTO from '../dtos/ICreateUserDTO';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

let fakeRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;
let service: CreateUserService;

describe('Create User', () => {
  beforeEach(() => {
    fakeCacheProvider = new FakeCacheProvider();
    fakeRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    service = new CreateUserService(
      fakeRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );
  });
  it('Deve criar um novo usuário', async () => {
    const createdUser = await service.execute({
      name: 'Leonardo Henrique de Braz',
      email: 'lhleonardo@hotmail.com',
      password: '123456',
    });

    expect(createdUser).toHaveProperty('id');
  });

  it('Não deve permitir e-mail duplicado', async () => {
    const user: ICreateUserDTO = {
      name: 'Leonardo Henrique de Braz',
      email: 'lhleonardo@hotmail.com',
      password: '123456',
    };

    await service.execute(user);

    expect(service.execute(user)).rejects.toBeInstanceOf(AppError);
  });
});
