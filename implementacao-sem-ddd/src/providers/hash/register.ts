import { container } from 'tsyringe';
import IHashProvider from './IHashProvider';
import BCryptHashProvider from './impl/BCryptHashProvider';

console.log("registrando...")

container.registerSingleton<IHashProvider>('HashProvider', BCryptHashProvider);

