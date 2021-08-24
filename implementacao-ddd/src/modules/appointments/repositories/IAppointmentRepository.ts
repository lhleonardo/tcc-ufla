import Appointment from '../infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '../dtos/ICreateAppointmentDTO';
import IFindAppointmentsInMonthDTO from '../dtos/IFIndAppointmentsInMonthDTO';
import IFindAllAppointmentInDay from '../dtos/IFindAllAppointmentInDay';

export default interface IAppointmentRepository {
  create(data: ICreateAppointmentDTO): Promise<Appointment>;

  findByDate(date: Date, providerId: string): Promise<Appointment | undefined>;

  findInMonth(data: IFindAppointmentsInMonthDTO): Promise<Appointment[]>;

  findAllInDay(data: IFindAllAppointmentInDay): Promise<Appointment[]>;
}
