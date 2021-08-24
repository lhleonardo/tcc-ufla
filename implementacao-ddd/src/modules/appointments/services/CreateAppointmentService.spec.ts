// PRECISA estar antes do serviço para não tentar injeção
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

import CreateAppointmentService from './CreateAppointmentService';
import AppError from '@shared/errors/AppError';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

let service: CreateAppointmentService;
let notificationsRepository: FakeNotificationsRepository;
let cacheProvider: FakeCacheProvider;
let appointmentsRepository: FakeAppointmentsRepository;

describe('CreateAppointment', () => {
  beforeEach(() => {
    appointmentsRepository = new FakeAppointmentsRepository();
    notificationsRepository = new FakeNotificationsRepository();
    cacheProvider = new FakeCacheProvider();
    service = new CreateAppointmentService(
      appointmentsRepository,
      notificationsRepository,
      cacheProvider,
    );
  });
  it('Deve criar um novo agendamento', async () => {
    jest
      .spyOn(Date, 'now')
      .mockImplementationOnce(() => new Date(2020, 4, 13, 10).getTime());
    const appointment = await service.execute({
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

    await service.execute({
      date: appointmentDate,
      userId: 'valid-user',
      providerId: 'provider-id',
    });

    expect(
      service.execute({
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
      service.execute({
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
      service.execute({
        date: new Date(2020, 4, 13, 7),
        providerId: 'provider-id',
        userId: 'valid-user',
      }),
    ).rejects.toBeInstanceOf(AppError);
    await expect(
      service.execute({
        date: new Date(2020, 4, 13, 18),
        providerId: 'provider-id',
        userId: 'valid-user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
