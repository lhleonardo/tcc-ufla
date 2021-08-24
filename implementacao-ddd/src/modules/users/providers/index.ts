import { container } from 'tsyringe';

import IHashProvider from './HashProvider/models/IHashProvider';
import BCryptHashProvider from './HashProvider/implementations/BCryptHashProvider';

import IUserRepository from '../repositories/IUserRepository';
import UserRepository from '../infra/typeorm/repositories/UserRepository';

import IUserTokenRepository from '../repositories/IUserTokenRepository';
import UserTokenRepository from '../infra/typeorm/repositories/UserTokenRepository';

container.registerSingleton<IHashProvider>('HashProvider', BCryptHashProvider);

container.registerSingleton<IUserRepository>('UserRepository', UserRepository);
container.registerSingleton<IUserTokenRepository>(
  'UserTokenRepository',
  UserTokenRepository,
);
