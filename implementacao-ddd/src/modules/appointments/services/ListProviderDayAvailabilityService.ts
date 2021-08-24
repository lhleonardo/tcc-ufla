import { getHours, isAfter } from 'date-fns';
import { inject, injectable } from 'tsyringe';
import IAppointmentRepository from '../repositories/IAppointmentRepository';

interface IRequest {
  providerId: string;
  year: number;
  month: number;
  day: number;
}

type IResponse = Array<{
  hour: number;
  available: boolean;
}>;

@injectable()
class ListProviderDayAvailabilityService {
  constructor(
    @inject('AppointmentRepository')
    private appointmentsRepository: IAppointmentRepository,
  ) {}
  public async execute({
    providerId,
    day,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllInDay({
      providerId,
      day,
      month,
      year,
    });

    const hoursOfWork = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
    const currentDate = Date.now();

    const availability = hoursOfWork.map(hour => {
      const hasAppointment = appointments.find(
        appointment => getHours(appointment.date) === hour,
      );

      const comparedDate = new Date(year, month - 1, day, hour);

      return {
        hour,
        available: !hasAppointment && isAfter(comparedDate, currentDate),
      };
    });

    return availability;
  }
}

export default ListProviderDayAvailabilityService;
