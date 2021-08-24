import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fake/FakeUsersRepository';
import ShowUserService from './ShowUserService';

let userRepository: FakeUsersRepository;
let showUserService: ShowUserService;

describe('ShowUserService', () => {
  beforeEach(() => {
    userRepository = new FakeUsersRepository();
    showUserService = new ShowUserService(userRepository);
  });
  it('Deve mostrar os dados do usuário logado', async () => {
    const loggedUser = await userRepository.create({
      name: 'Leonardo Braz',
      email: 'lhleonardo@hotmail.com',
      password: '123123',
    });

    const user = await showUserService.execute(loggedUser.id);

    expect(user.name).toBe(loggedUser.name);
    expect(user.email).toBe(loggedUser.email);
  });

  it('Não deve mostrar dados de um usuário inexistente', async () => {
    await expect(
      showUserService.execute('wrong-user-id'),
    ).rejects.toBeInstanceOf(AppError);
  });
});
