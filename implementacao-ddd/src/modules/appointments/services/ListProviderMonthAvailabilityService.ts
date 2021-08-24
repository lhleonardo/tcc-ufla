import { getDate, getDaysInMonth, isBefore, endOfDay } from 'date-fns';
import { inject, injectable } from 'tsyringe';
import IAppointmentRepository from '../repositories/IAppointmentRepository';

interface IRequest {
  providerId: string;
  month: number;
  year: number;
}

type IResponse = Array<{
  day: number;
  available: boolean;
}>;

@injectable()
export default class ListProviderMonthAvailabilityService {
  constructor(
    @inject('AppointmentRepository')
    private appointmentRepository: IAppointmentRepository,
  ) {}
  public async execute({
    providerId,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentRepository.findInMonth({
      providerId,
      year,
      month,
    });

    const today = Date.now();

    const numberOfDays = getDaysInMonth(new Date(year, month - 1));

    const days = Array.from({ length: numberOfDays }, (_, index) => {
      const day = index + 1;

      const appointmentsInDay = appointments.filter(
        appointment => getDate(appointment.date) === day,
      );

      const isValidDay = isBefore(
        today,
        endOfDay(new Date(year, month - 1, day)),
      );

      return {
        day,
        available: isValidDay && appointmentsInDay.length < 10,
      };
    });

    return days;
  }
}
