import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';
import { inject, injectable } from 'tsyringe';
import IMailTemplateProvider from '../../MailTemplateProvider/models/IMailTemplateProvider';
import ISendMailDTO from '../dtos/ISendMailDTO';

import IMailProvider from '../models/IMailProvider';

@injectable()
export default class EtherealMailProvider implements IMailProvider {
  private client: Transporter;
  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider,
  ) {
    nodemailer.createTestAccount().then(account => {
      this.client = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });
    });
  }

  async sendMail({ to, from, subject, template }: ISendMailDTO): Promise<void> {
    const content: SendMailOptions = {
      to: {
        name: to.name,
        address: to.email,
      },
      from: {
        name: from?.name ?? 'Equipe GoBarber',
        address: from?.email ?? 'equipe@gobarber.com.br',
      },
      subject: subject,
      html: await this.mailTemplateProvider.generate(template),
    };

    const message = await this.client.sendMail(content);

    console.log('Message sent: %s', message.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
  }
}
