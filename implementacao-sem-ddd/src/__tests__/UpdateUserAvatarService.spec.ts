import AppError from '@errors/AppError';
import FakeStorageProvider from '@providers/storage/impl/FakeStorageProvider';
import FakeUsersRepository from '@repositories/fakes/FakeUsersRepository';
import AvatarService from '@services/avatar.service';

let fakeStorage: FakeStorageProvider;
let fakeRepository: FakeUsersRepository;
let updateUserAvatar: AvatarService;

describe('Update Avatar', () => {
  beforeEach(() => {
    fakeStorage = new FakeStorageProvider();
    fakeRepository = new FakeUsersRepository();
    updateUserAvatar = new AvatarService(fakeRepository, fakeStorage);
  });
  it('Deve atualizar a foto de perfil', async () => {
    const user = await fakeRepository.create({
      email: 'lhleonardo@hotmail.com',
      name: 'Leonardo Braz',
      password: '123456',
    });

    const response = await updateUserAvatar.updateAvatar({
      userId: user.id,
      avatarFilename: 'avatar.png',
    });

    expect(response.avatar).toBe('avatar.png');
  });

  it('Não deve atualizar avatar de usuário inválido', async () => {
    await expect(
      updateUserAvatar.updateAvatar({
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

    await updateUserAvatar.updateAvatar({
      userId: user.id,
      avatarFilename: 'avatar.png',
    });

    await updateUserAvatar.updateAvatar({
      userId: user.id,
      avatarFilename: 'avatar_2.png',
    });

    expect(mockedMethod).toBeCalledWith('avatar.png');
  });
});
