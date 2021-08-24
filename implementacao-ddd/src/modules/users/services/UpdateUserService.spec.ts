import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fake/FakeUsersRepository';
import UpdateUserService from './UpdateUserService';

let userRepository: FakeUsersRepository;
let hashProvider: FakeHashProvider;
let updateUser: UpdateUserService;

describe('Update User', () => {
  beforeEach(() => {
    userRepository = new FakeUsersRepository();
    hashProvider = new FakeHashProvider();

    updateUser = new UpdateUserService(userRepository, hashProvider);
  });

  it('Não deve atualizar o perfil de um usuário inválido', async () => {
    await expect(
      updateUser.execute('wrong-user-id', {
        name: 'Leonardo Braz',
        email: 'lhleonardo@hotmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Deve atualizar o perfil', async () => {
    const createdUser = await userRepository.create({
      name: 'Leonardo Henrique Braz',
      email: 'lhleonardo@hotmail.com',
      password: '123123',
    });

    await updateUser.execute(createdUser.id, {
      name: 'Leonardo Braz',
      email: 'lhleonardo05@gmail.com',
      oldPassword: '123123',
      password: 'maracuja',
    });

    const updatedUser = await userRepository.findById(createdUser.id);

    expect(updatedUser?.name).toBe('Leonardo Braz');
    expect(updatedUser?.email).toBe('lhleonardo05@gmail.com');
    expect(updatedUser?.password).toBe('maracuja');
  });

  it('Deve alterar a senha somente confirmando a senha antiga', async () => {
    const createdUser = await userRepository.create({
      name: 'Leonardo Braz',
      email: 'lhleonardo@hotmail.com',
      password: '123456',
    });

    await expect(
      updateUser.execute(createdUser.id, {
        name: createdUser.name,
        email: createdUser.email,
        oldPassword: '1234',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Não deve alterar a senha se não informar senha antiga', async () => {
    const createdUser = await userRepository.create({
      name: 'Leonardo Braz',
      email: 'lhleonardo@hotmail.com',
      password: '123456',
    });

    await expect(
      updateUser.execute(createdUser.id, {
        name: createdUser.name,
        email: createdUser.email,
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Não deve alterar a senha se não informar uma nova senha', async () => {
    const createdUser = await userRepository.create({
      name: 'Leonardo Braz',
      email: 'lhleonardo@hotmail.com',
      password: '123456',
    });

    const updated = await updateUser.execute(createdUser.id, {
      name: createdUser.name,
      email: createdUser.email,
      oldPassword: '123456',
    });

    expect(updated).toBe(createdUser);
  });

  it('Não deve atualizar o e-mail caso troque para um já existente', async () => {
    await userRepository.create({
      name: 'Julia Caroline',
      email: 'julia@gmail.com',
      password: '123456',
    });

    const user = await userRepository.create({
      name: 'Leonardo Braz',
      email: 'lhleonardo@hotmail.com',
      password: '123123',
    });

    await expect(
      updateUser.execute(user.id, {
        name: 'Leonardo Braz',
        email: 'julia@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
