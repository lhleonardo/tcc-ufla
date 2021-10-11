import Appointment from '@models/Appointment';
import ICreateAppointmentDTO from './dtos/ICreateAppointmentDTO';
import IFindAllAppointmentInDay from './dtos/IFindAllAppointmentInDay';
import IFindAppointmentsInMonthDTO from './dtos/IFIndAppointmentsInMonthDTO';

export default interface IAppointmentRepository {
  create(data: ICreateAppointmentDTO): Promise<Appointment>;

  findByDate(date: Date, providerId: string): Promise<Appointment | undefined>;

  findInMonth(data: IFindAppointmentsInMonthDTO): Promise<Appointment[]>;

  findAllInDay(data: IFindAllAppointmentInDay): Promise<Appointment[]>;
}
