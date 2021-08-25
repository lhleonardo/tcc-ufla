import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let appointmentsRepository: FakeAppointmentRepository;
let listProviderMonthAvailability: ListProviderMonthAvailabilityService;

describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    appointmentsRepository = new FakeAppointmentRepository();
    listProviderMonthAvailability = new ListProviderMonthAvailabilityService(
      appointmentsRepository,
    );
  });

  it('Deve listar a disponibilidade de um prestador em um mês', async () => {
    // não deve sair na relação de dias

    const today = new Date()

    const year = today.getFullYear()
    const month = today.getMonth()
    const day = today.getDate() + 1


    const scheduledDay = day + 1

    await appointmentsRepository.create({
      providerId: 'valid-provider-user',
      userId: 'valid-user',
      date: new Date(year, month, day, 8, 0, 0),
    });

    // enche um dia todo de agendamentos para um provider
    for (let i = 8; i <= 17; i++) {
      await appointmentsRepository.create({
        providerId: 'valid-provider-user',
        userId: 'valid-user',
        date: new Date(year, month, scheduledDay, i, 0, 0),
      });
    }

    const availability = await listProviderMonthAvailability.execute({
      providerId: 'valid-provider-user',
      month: month + 1,
      year,
    });

    const freeDay = scheduledDay + 1

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: freeDay, available: true },
        { day: freeDay + 1, available: true },
        { day: freeDay + 2, available: true },
        { day: scheduledDay, available: false },
      ]),
    );

    // expect(availability).toEqual(expect.arrayContaining());
  });
});
