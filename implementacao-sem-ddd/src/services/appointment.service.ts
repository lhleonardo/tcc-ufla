import AppError from '@errors/AppError';
import ICacheProvider from '@providers/cache/ICacheProvider';
import IAppointmentRepository from '@repositories/IAppointmentRepository';
import INotificationsRepository from '@repositories/INotificationsRepository';
import { inject, injectable } from 'tsyringe';

import { format, getHours, isBefore, startOfHour } from 'date-fns';

import { ptBR } from 'date-fns/locale';
import ICreateAppointmentDTO from '@repositories/dtos/ICreateAppointmentDTO';
import Appointment from '@models/Appointment';
import IFindAllAppointmentInDay from '@repositories/dtos/IFindAllAppointmentInDay';
import { classToClass } from 'class-transformer';

@injectable()
class AppointmentService {
  constructor(
    @inject('AppointmentRepository')
    private appointmentRepository: IAppointmentRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async create({
    providerId,
    date,
    userId,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const parsedDate = startOfHour(date);

    if (isBefore(parsedDate, Date.now())) {
      throw new AppError('Esse horário é inválido pois ele já passou.');
    }

    const hour = getHours(parsedDate);

    if (hour < 8 || hour > 17) {
      throw new AppError('Fora do horário de trabalho (entre 08:00 até 17:00)');
    }

    const findAppointmentInSameDate = await this.appointmentRepository.findByDate(
      parsedDate,
      providerId,
    );
    if (findAppointmentInSameDate) {
      throw new AppError('Esse horário já foi agendado');
    }

    const appointment = await this.appointmentRepository.create({
      providerId,
      userId,
      date: parsedDate,
    });

    const formattedDate = format(parsedDate, "dd/MM/yyyy 'às' HH:mm'h'", {
      locale: ptBR,
    });

    await this.notificationsRepository.create({
      recipientId: providerId,
      content: `Novo agendamento marcado para o dia ${formattedDate}`,
    });

    await this.cacheProvider.invalidate(
      `provider-appointments:${providerId}:${format(parsedDate, 'yyyy-M-d')}`,
    );

    return appointment;
  }

  public async find({
    providerId,
    day,
    month,
    year,
  }: IFindAllAppointmentInDay): Promise<Appointment[]> {
    const cacheKey = `provider-appointments:${providerId}:${year}-${month}-${day}`;

    let appointments = await this.cacheProvider.recovery<Appointment[]>(
      cacheKey,
    );

    if (!appointments) {
      appointments = classToClass(
        await this.appointmentRepository.findAllInDay({
          providerId,
          day,
          month,
          year,
        }),
      );

      await this.cacheProvider.save(cacheKey, appointments);
    }

    return appointments;
  }
}

export default AppointmentService;
