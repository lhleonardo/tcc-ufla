import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import { Repository, getRepository, Raw } from 'typeorm';
import IFindAppointmentsInMonthDTO from '@modules/appointments/dtos/IFIndAppointmentsInMonthDTO';
import IFindAllAppointmentInDay from '@modules/appointments/dtos/IFindAllAppointmentInDay';

export default class AppointmentRepository implements IAppointmentRepository {
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  public async create({
    providerId,
    date,
    userId,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create({
      providerId,
      date,
      userId,
    });

    await this.ormRepository.save(appointment);

    return appointment;
  }

  public async findInMonth({
    providerId,
    year,
    month,
  }: IFindAppointmentsInMonthDTO): Promise<Appointment[]> {
    const parsedMonth = month.toString().padStart(2, '0');
    const appointments = await this.ormRepository.find({
      where: {
        providerId,
        date: Raw(
          fieldName =>
            `to_char(${fieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'`,
        ),
      },
    });
    return appointments;
  }

  public async findAllInDay({
    providerId,
    day,
    month,
    year,
  }: IFindAllAppointmentInDay): Promise<Appointment[]> {
    const parsedMonth = month.toString().padStart(2, '0');
    const parsedDay = day.toString().padStart(2, '0');
    const appointments = await this.ormRepository.find({
      where: {
        providerId,
        date: Raw(
          fieldName =>
            `to_char(${fieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`,
        ),
      },
      order: {
        date: 'ASC',
      },
      relations: ['user'],
    });
    return appointments;
  }

  public async findByDate(
    date: Date,
    providerId: string,
  ): Promise<Appointment | undefined> {
    const findAppointment = await this.ormRepository.findOne({
      where: {
        date,
        providerId,
      },
      relations: ['user'],
    });

    return findAppointment;
  }
}
