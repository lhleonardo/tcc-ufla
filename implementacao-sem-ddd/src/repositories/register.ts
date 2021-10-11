import { container } from 'tsyringe';
import IAppointmentRepository from './IAppointmentRepository';
import AppointmentRepository from './implementations/AppointmentRepository';
import NotificationsRepository from './implementations/NotificationRepositories';
import UserRepository from './implementations/UserRepository';
import UserTokenRepository from './implementations/UserTokenRepository';
import INotificationsRepository from './INotificationsRepository';
import IUserRepository from './IUserRepository';
import IUserTokenRepository from './IUserTokenRepository';

container.registerSingleton<IAppointmentRepository>(
    'AppointmentRepository',
    AppointmentRepository,
);

container.registerSingleton<INotificationsRepository>(
    'NotificationsRepository',
    NotificationsRepository,
);

container.registerSingleton<IUserRepository>('UserRepository', UserRepository);

container.registerSingleton<IUserTokenRepository>(
    'UserTokenRepository',
    UserTokenRepository,
);
