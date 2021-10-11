import AppError from '@errors/AppError';
import FakeCacheProvider from '@providers/cache/impl/FakeCacheProvider';
import FakeHashProvider from '@providers/hash/impl/FakeHashProvider';
import ICreateUserDTO from '@repositories/dtos/ICreateUserDTO';
import FakeUsersRepository from '@repositories/fakes/FakeUsersRepository';
import UserService from '@services/user.service';

let fakeRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;
let service: UserService;

describe('Create User', () => {
  beforeEach(() => {
    fakeCacheProvider = new FakeCacheProvider();
    fakeRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    service = new UserService(
      fakeRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );
  });
  it('Deve criar um novo usuário', async () => {
    const createdUser = await service.createUser({
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

    await service.createUser(user);

    expect(service.createUser(user)).rejects.toBeInstanceOf(AppError);
  });
});
