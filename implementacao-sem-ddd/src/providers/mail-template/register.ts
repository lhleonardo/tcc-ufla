import { container } from 'tsyringe';
import IMailTemplateProvider from './IMailTemplateProvider';
import HandlebarsMailTemplateProvider from './impl/HandlebarsMailTemplateProvider';

const providers = {
  handlebars: HandlebarsMailTemplateProvider,
};

container.registerSingleton<IMailTemplateProvider>(
  'MailTemplateProvider',
  providers.handlebars,
);
