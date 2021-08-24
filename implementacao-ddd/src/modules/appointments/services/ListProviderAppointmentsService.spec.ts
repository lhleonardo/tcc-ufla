import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';

let appointmentsRepository: FakeAppointmentRepository;
let listProviderAppointments: ListProviderAppointmentsService;
let cacheProvider: FakeCacheProvider;

describe('ListProviderAppointments', () => {
  beforeEach(() => {
    appointmentsRepository = new FakeAppointmentRepository();
    cacheProvider = new FakeCacheProvider();
    listProviderAppointments = new ListProviderAppointmentsService(
      appointmentsRepository,
      cacheProvider,
    );
  });
  it('Deve mostrar os agendamentos de um determinado prestador', async () => {
    jest
      .spyOn(Date, 'now')
      .mockImplementation(() => new Date(2020, 8, 15, 8).getTime());

    const app1 = await appointmentsRepository.create({
      date: new Date(2020, 8, 15, 9),
      providerId: 'provider-id',
      userId: 'user-id',
    });

    const app2 = await appointmentsRepository.create({
      date: new Date(2020, 8, 15, 13),
      providerId: 'provider-id',
      userId: 'user-id',
    });

    const app3 = await appointmentsRepository.create({
      date: new Date(2020, 8, 15, 15),
      providerId: 'provider-id',
      userId: 'user-id',
    });

    const app4 = await appointmentsRepository.create({
      date: new Date(2020, 8, 15, 10),
      providerId: 'another-provider-id',
      userId: 'user-id',
    });

    const app5 = await appointmentsRepository.create({
      date: new Date(2020, 8, 15, 11),
      providerId: 'another-provider-id',
      userId: 'user-id',
    });

    const appointments = await listProviderAppointments.execute({
      providerId: 'provider-id',
      day: 15,
      month: 9,
      year: 2020,
    });

    expect(appointments).toEqual([app1, app2, app3]);

    expect(appointments).not.toEqual([app4, app5]);
  });

  it('Deve não mostrar agendamentos caso não tenham sido marcados', async () => {
    jest
      .spyOn(Date, 'now')
      .mockImplementation(() => new Date(2020, 8, 15, 8).getTime());

    await appointmentsRepository.create({
      date: new Date(2020, 8, 15, 15),
      providerId: 'provider-id',
      userId: 'user-id',
    });

    await appointmentsRepository.create({
      date: new Date(2020, 8, 15, 12),
      providerId: 'provider-id',
      userId: 'user-id',
    });

    await appointmentsRepository.create({
      date: new Date(2020, 8, 15, 9),
      providerId: 'provider-id',
      userId: 'user-id',
    });

    const appointments = await listProviderAppointments.execute({
      providerId: 'another-provider-id',
      day: 15,
      month: 9,
      year: 2020,
    });

    expect(appointments).toEqual([]);
  });
});
