import FakeCacheProvider from '@providers/cache/impl/FakeCacheProvider';
import FakeUsersRepository from '@repositories/fakes/FakeUsersRepository';
import IAppointmentRepository from '@repositories/IAppointmentRepository';
import ProviderService from '@services/provider.service';

let userRepository: FakeUsersRepository;
let listProviders: ProviderService;
let cacheProvider: FakeCacheProvider;

describe('ListProviders', () => {
  beforeEach(() => {
    userRepository = new FakeUsersRepository();
    cacheProvider = new FakeCacheProvider();
    listProviders = new ProviderService(
      userRepository,
      cacheProvider,
      {} as IAppointmentRepository,
    );
  });
  it('Deve listar todos os prestadores de serviço', async () => {
    const loggedUser = await userRepository.create({
      name: 'Leonardo Braz',
      email: 'lhleonardo@hotmail.com',
      password: '123123',
    });
    const provider1 = await userRepository.create({
      name: 'Matheus Castro',
      email: 'matheus@hotmail.com',
      password: '123123',
    });
    const provider2 = await userRepository.create({
      name: 'Maria Aparecida',
      email: 'maria@hotmail.com',
      password: '123123',
    });

    const providers = await listProviders.getProviders({
      excludeUserId: loggedUser.id,
    });

    // vem com o avatar nulo pois não foi atribuido nenhum avatar aqui
    const expectedUsers = [provider1, provider2].map(({id, name, email,}) => ({
      id, name, email, avatarURL: null
    }));

    expect(providers).toEqual(expect.arrayContaining(expectedUsers));
  });
});
