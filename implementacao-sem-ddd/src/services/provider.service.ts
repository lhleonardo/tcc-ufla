import User from '@models/User';
import ICacheProvider from '@providers/cache/ICacheProvider';
import IFindAllProvidersDTO from '@repositories/dtos/IFindAllProvidersDTO';
import IAppointmentRepository from '@repositories/IAppointmentRepository';
import IUserRepository from '@repositories/IUserRepository';
import { classToClass } from 'class-transformer';
import {
  endOfDay,
  getDate,
  getDaysInMonth,
  getHours,
  isAfter,
  isBefore,
} from 'date-fns';
import { inject, injectable } from 'tsyringe';

type IFindProvidersByDayAvailability = {
  providerId: string;
  year: number;
  month: number;
  day: number;
};

type IProviderDayAvailability = Array<{
  hour: number;
  available: boolean;
}>;

type IFindProvidersByMonthAvailability = {
  providerId: string;
  month: number;
  year: number;
};

type IProviderMonthAvailability = Array<{
  day: number;
  available: boolean;
}>;

@injectable()
class ProviderService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,

    @inject('AppointmentRepository')
    private appointmentsRepository: IAppointmentRepository,
  ) {}

  public async getProviders({
    excludeUserId,
  }: IFindAllProvidersDTO): Promise<User[]> {
    let providers = await this.cacheProvider.recovery<User[]>(
      `list-providers:${excludeUserId}`,
    );
    if (!providers) {
      providers = classToClass(
        await this.userRepository.findAllProviders({
          excludeUserId,
        }),
      );

      await this.cacheProvider.save(
        `list-providers:${excludeUserId}`,
        providers,
      );
    }

    return providers;
  }

  public async findByDayAvailability({
    providerId,
    day,
    month,
    year,
  }: IFindProvidersByDayAvailability): Promise<IProviderDayAvailability> {
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

  public async findByMonthAvailability({
    providerId,
    month,
    year,
  }: IFindProvidersByMonthAvailability): Promise<IProviderMonthAvailability> {
    const appointments = await this.appointmentsRepository.findInMonth({
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

export default ProviderService;
