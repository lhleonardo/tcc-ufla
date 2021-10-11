import ICacheProvider from '@providers/cache/ICacheProvider';
import FakeAppointmentRepository from '@repositories/fakes/FakeAppointmentsRepository';
import IUserRepository from '@repositories/IUserRepository';
import ProviderService from '@services/provider.service';

let appointmentsRepository: FakeAppointmentRepository;
let listProviderMonthAvailability: ProviderService;

describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    appointmentsRepository = new FakeAppointmentRepository();
    listProviderMonthAvailability = new ProviderService(
      {} as IUserRepository,
      {} as ICacheProvider,
      appointmentsRepository,
    );
  });

  it('Deve listar a disponibilidade de um prestador em um mês', async () => {
    // não deve sair na relação de dias
    await appointmentsRepository.create({
      providerId: 'valid-provider-user',
      userId: 'valid-user',
      date: new Date(2020, 4, 12, 8, 0, 0),
    });

    // enche um dia todo de agendamentos para um provider
    for (let i = 8; i <= 17; i++) {
      await appointmentsRepository.create({
        providerId: 'valid-provider-user',
        userId: 'valid-user',
        date: new Date(2020, 4, 13, i, 0, 0),
      });
    }

    const availability = await listProviderMonthAvailability.findByMonthAvailability(
      {
        providerId: 'valid-provider-user',
        month: 5,
        year: 2020,
      },
    );

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 11, available: true },
        { day: 12, available: true },
        { day: 13, available: false },
        { day: 14, available: true },
      ]),
    );

    // expect(availability).toEqual(expect.arrayContaining());
  });
});
