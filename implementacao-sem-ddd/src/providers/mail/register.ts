import mailConfig from '@config/mail';
import { container } from 'tsyringe';
import IMailProvider from './IMailProvider';
import EtherealMailProvider from './impl/EtherealMailProvider';
import SESMailProvider from './impl/SESMailProvider';

const providers = {
  ses: container.resolve(SESMailProvider),
  ethereal: container.resolve(EtherealMailProvider),
};

container.registerInstance<IMailProvider>(
  'MailProvider',
  providers[mailConfig.driver],
);
