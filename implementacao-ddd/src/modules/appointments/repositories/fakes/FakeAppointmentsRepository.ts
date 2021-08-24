import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';

import { v4 as uuid } from 'uuid';
import { getDate, getMonth, getYear, isEqual } from 'date-fns';
import IFindAppointmentsInMonthDTO from '@modules/appointments/dtos/IFIndAppointmentsInMonthDTO';
import IFindAllAppointmentInDay from '@modules/appointments/dtos/IFindAllAppointmentInDay';

export default class FakeAppointmentRepository
  implements IAppointmentRepository {
  private appointments: Appointment[] = [];

  public async create({
    providerId,
    date,
    userId,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment();

    // mesmo que fazer appointment.id = uuid(), ...
    Object.assign(appointment, { id: uuid(), providerId, userId, date });

    this.appointments.push(appointment);
    return appointment;
  }

  public async findInMonth({
    providerId,
    year,
    month,
  }: IFindAppointmentsInMonthDTO): Promise<Appointment[]> {
    const appointments = this.appointments.filter(
      appointment =>
        appointment.providerId === providerId &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year,
    );

    return appointments;
  }

  public async findByDate(
    date: Date,
    providerId: string,
  ): Promise<Appointment | undefined> {
    const findAppointment = this.appointments.find(
      appointment =>
        isEqual(appointment.date, date) &&
        appointment.providerId === providerId,
    );

    return findAppointment;
  }

  public async findAllInDay({
    providerId,
    day,
    month,
    year,
  }: IFindAllAppointmentInDay): Promise<Appointment[]> {
    const appointments = this.appointments.filter(
      appointment =>
        appointment.providerId === providerId &&
        getYear(appointment.date) === year &&
        getMonth(appointment.date) + 1 === month &&
        getDate(appointment.date) === day,
    );
    return appointments;
  }
}
