import { container } from 'tsyringe';

import IAppointmentRepository from '../repositories/IAppointmentRepository';
import AppointmentRepository from '../infra/typeorm/repositories/AppointmentRepository';

container.registerSingleton<IAppointmentRepository>(
  'AppointmentRepository',
  AppointmentRepository,
);
