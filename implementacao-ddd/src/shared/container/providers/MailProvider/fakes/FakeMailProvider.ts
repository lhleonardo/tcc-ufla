import ISendMailDTO from '../dtos/ISendMailDTO';
import IMailProvider from '../models/IMailProvider';

export default class FakeMailProvider implements IMailProvider {
  private mails: ISendMailDTO[] = [];
  async sendMail(data: ISendMailDTO): Promise<void> {
    this.mails.push(data);
  }
}
