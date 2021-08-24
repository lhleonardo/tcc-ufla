import IGenerateMailTemplateDTO from '../../MailTemplateProvider/dtos/IGenerateMailTemplateDTO';

interface IMailContact {
  name: string;
  email: string;
}

export default interface ISendMailDTO {
  to: IMailContact;
  from?: IMailContact;
  subject: string;
  template: IGenerateMailTemplateDTO;
}
