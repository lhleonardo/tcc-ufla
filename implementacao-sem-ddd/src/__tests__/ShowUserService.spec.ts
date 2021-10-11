import AppError from '@errors/AppError';
import ICacheProvider from '@providers/cache/ICacheProvider';
import IHashProvider from '@providers/hash/IHashProvider';
import FakeUsersRepository from '@repositories/fakes/FakeUsersRepository';
import UserService from '@services/user.service';

let userRepository: FakeUsersRepository;
let showUserService: UserService;

describe('ShowUserService', () => {
  beforeEach(() => {
    userRepository = new FakeUsersRepository();
    showUserService = new UserService(
      userRepository,
      {} as IHashProvider,
      {} as ICacheProvider,
    );
  });
  it('Deve mostrar os dados do usuário logado', async () => {
    const loggedUser = await userRepository.create({
      name: 'Leonardo Braz',
      email: 'lhleonardo@hotmail.com',
      password: '123123',
    });

    const user = await showUserService.get(loggedUser.id);

    expect(user.name).toBe(loggedUser.name);
    expect(user.email).toBe(loggedUser.email);
  });

  it('Não deve mostrar dados de um usuário inexistente', async () => {
    await expect(showUserService.get('wrong-user-id')).rejects.toBeInstanceOf(
      AppError,
    );
  });
});
