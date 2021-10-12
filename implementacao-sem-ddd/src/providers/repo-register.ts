import IAppointmentRepository from '@repositories/IAppointmentRepository';
import AppointmentRepository from '@repositories/implementations/AppointmentRepository';
import NotificationsRepository from '@repositories/implementations/NotificationRepositories';
import UserRepository from '@repositories/implementations/UserRepository';
import UserTokenRepository from '@repositories/implementations/UserTokenRepository';
import INotificationsRepository from '@repositories/INotificationsRepository';
import IUserRepository from '@repositories/IUserRepository';
import IUserTokenRepository from '@repositories/IUserTokenRepository';
import { container } from 'tsyringe';

container.registerSingleton<IUserRepository>('UserRepository', UserRepository);
container.registerSingleton<IUserTokenRepository>(
  'UserTokenRepository',
  UserTokenRepository,
);

container.registerSingleton<INotificationsRepository>(
  'NotificationsRepository',
  NotificationsRepository,
);

container.registerSingleton<IAppointmentRepository>(
  'AppointmentRepository',
  AppointmentRepository,
);
