import nodemailer, { SendMailOptions, Transporter } from 'nodemailer';
import { inject, injectable } from 'tsyringe';
import IMailTemplateProvider from '../../MailTemplateProvider/models/IMailTemplateProvider';
import ISendMailDTO from '../dtos/ISendMailDTO';

import mailConfig from '@config/mail';

import aws from 'aws-sdk';

import IMailProvider from '../models/IMailProvider';

@injectable()
export default class SESMailProvider implements IMailProvider {
  private client: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider,
  ) {
    this.client = nodemailer.createTransport({
      SES: new aws.SES({
        apiVersion: '2010-12-01', // uma boa versão da api da aws
      }),
    });
  }

  async sendMail({ to, subject, template }: ISendMailDTO): Promise<void> {
    const { from } = mailConfig.defaults;
    const content: SendMailOptions = {
      to: {
        name: to.name,
        address: to.email,
      },
      from: {
        name: from.name,
        address: from.email,
      },
      subject: subject,
      html: await this.mailTemplateProvider.generate(template),
    };

    await this.client.sendMail(content);
  }
}
