import IGenerateMailTemplateDTO from '@providers/mail-template/IGenerateMailTemplateDTO';

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
