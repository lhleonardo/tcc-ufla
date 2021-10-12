import { container } from 'tsyringe';
import IHashProvider from './IHashProvider';
import BCryptHashProvider from './impl/BCryptHashProvider';

container.registerSingleton<IHashProvider>('HashProvider', BCryptHashProvider);

