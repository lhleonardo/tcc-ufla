// PRECISA estar antes do serviço para não tentar injeção
import AppError from '@errors/AppError';
import FakeCacheProvider from '@providers/cache/impl/FakeCacheProvider';
import FakeAppointmentsRepository from '@repositories/fakes/FakeAppointmentsRepository';
import FakeNotificationsRepository from '@repositories/fakes/FakeNotificationsRepository';
import AppointmentService from '@services/appointment.service';

let service: AppointmentService;
let notificationsRepository: FakeNotificationsRepository;
let cacheProvider: FakeCacheProvider;
let appointmentsRepository: FakeAppointmentsRepository;

describe('CreateAppointment', () => {
  beforeEach(() => {
    appointmentsRepository = new FakeAppointmentsRepository();
    notificationsRepository = new FakeNotificationsRepository();
    cacheProvider = new FakeCacheProvider();
    service = new AppointmentService(
      appointmentsRepository,
      notificationsRepository,
      cacheProvider,
    );
  });
  it('Deve criar um novo agendamento', async () => {
    jest
      .spyOn(Date, 'now')
      .mockImplementationOnce(() => new Date(2020, 4, 13, 10).getTime());
    const appointment = await service.create({
      date: new Date(2020, 4, 16, 9),
      userId: 'valid-user',
      providerId: 'provider-id',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.providerId).toBe('provider-id');
  });

  it('Não deve criar dois agendamentos no mesmo dia', async () => {
    const appointmentDate = new Date(2020, 4, 13, 13);

    jest
      .spyOn(Date, 'now')
      .mockImplementation(() => new Date(2020, 4, 13, 10).getTime());

    await service.create({
      date: appointmentDate,
      userId: 'valid-user',
      providerId: 'provider-id',
    });

    expect(
      service.create({
        date: appointmentDate,
        providerId: 'provider-id',
        userId: 'valid-user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Não deve criar agendamentos em datas que já passaram', async () => {
    jest
      .spyOn(Date, 'now')
      .mockImplementationOnce(() => new Date(2020, 4, 13, 16).getTime());

    await expect(
      service.create({
        date: new Date(2020, 4, 13, 11),
        providerId: 'provider-id',
        userId: 'valid-user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Não deve criar agendamentos fora do horário de atendimento (08:00-17:00)', async () => {
    jest
      .spyOn(Date, 'now')
      .mockImplementationOnce(() => new Date(2020, 4, 12, 16).getTime());

    await expect(
      service.create({
        date: new Date(2020, 4, 13, 7),
        providerId: 'provider-id',
        userId: 'valid-user',
      }),
    ).rejects.toBeInstanceOf(AppError);
    await expect(
      service.create({
        date: new Date(2020, 4, 13, 18),
        providerId: 'provider-id',
        userId: 'valid-user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
