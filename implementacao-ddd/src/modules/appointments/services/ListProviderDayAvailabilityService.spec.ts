import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';

let appointmentRepository: FakeAppointmentRepository;
let listProviderDayAvailability: ListProviderDayAvailabilityService;

describe('ListProviderDayAvailability', () => {
  beforeEach(() => {
    appointmentRepository = new FakeAppointmentRepository();
    listProviderDayAvailability = new ListProviderDayAvailabilityService(
      appointmentRepository,
    );
  });
  it('Deve mostrar os horários disponíveis de um prestador em um determinado dia', async () => {
    jest
      .spyOn(Date, 'now')
      .mockImplementation(() => new Date(2020, 3, 15, 7).getTime());

    await appointmentRepository.create({
      providerId: 'valid-provider-id',
      userId: 'valid-user-id',
      date: new Date(2020, 3, 15, 8, 0, 0),
    });

    await appointmentRepository.create({
      providerId: 'valid-provider-id',
      userId: 'valid-user-id',
      date: new Date(2020, 3, 15, 10, 0, 0),
    });

    await appointmentRepository.create({
      providerId: 'valid-provider-id',
      userId: 'valid-user-id',
      date: new Date(2020, 3, 15, 12, 0, 0),
    });

    await appointmentRepository.create({
      providerId: 'valid-provider-id',
      userId: 'valid-user-id',
      date: new Date(2020, 3, 15, 13, 0, 0),
    });

    await appointmentRepository.create({
      providerId: 'valid-provider-id',
      userId: 'valid-user-id',
      date: new Date(2020, 3, 15, 16, 0, 0),
    });

    const availability = await listProviderDayAvailability.execute({
      providerId: 'valid-provider-id',
      day: 15,
      month: 4,
      year: 2020,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 9, available: true },
        { hour: 10, available: false },
        { hour: 11, available: true },
        { hour: 12, available: false },
        { hour: 13, available: false },
        { hour: 14, available: true },
        { hour: 15, available: true },
        { hour: 16, available: false },
        { hour: 17, available: true },
      ]),
    );
  });
});
