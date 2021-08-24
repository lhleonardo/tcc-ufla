import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fake/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';
import AppError from '@shared/errors/AppError';

let fakeStorage: FakeStorageProvider;
let fakeRepository: FakeUsersRepository;
let updateUserAvatar: UpdateUserAvatarService;

describe('Update Avatar', () => {
  beforeEach(() => {
    fakeStorage = new FakeStorageProvider();
    fakeRepository = new FakeUsersRepository();
    updateUserAvatar = new UpdateUserAvatarService(fakeRepository, fakeStorage);
  });
  it('Deve atualizar a foto de perfil', async () => {
    const user = await fakeRepository.create({
      email: 'lhleonardo@hotmail.com',
      name: 'Leonardo Braz',
      password: '123456',
    });

    const response = await updateUserAvatar.execute({
      userId: user.id,
      avatarFilename: 'avatar.png',
    });

    expect(response.avatar).toBe('avatar.png');
  });

  it('Não deve atualizar avatar de usuário inválido', async () => {
    await expect(
      updateUserAvatar.execute({
        userId: 'invalid_user_id',
        avatarFilename: 'avatar.png',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Deve trocar a foto de perfil do usuário e apagar a antiga', async () => {
    const mockedMethod = jest.spyOn(fakeStorage, 'deleteFile');

    const user = await fakeRepository.create({
      name: 'Leonardo Henrique de Braz',
      email: 'lhleonardo@hotmail.com',
      password: '123456',
    });

    await updateUserAvatar.execute({
      userId: user.id,
      avatarFilename: 'avatar.png',
    });

    await updateUserAvatar.execute({
      userId: user.id,
      avatarFilename: 'avatar_2.png',
    });

    expect(mockedMethod).toBeCalledWith('avatar.png');
  });
});
