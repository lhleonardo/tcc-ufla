import ISendMailDTO from '../ISendMailDTO';
import IMailProvider from '../IMailProvider';

export default class FakeMailProvider implements IMailProvider {
  private mails: ISendMailDTO[] = [];
  async sendMail(data: ISendMailDTO): Promise<void> {
    this.mails.push(data);
  }
}
