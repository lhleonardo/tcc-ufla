import IGenerateMailTemplateDTO from "../dtos/IGenerateMailTemplateDTO";
import IMailTemplateProvider from "../models/IMailTemplateProvider";

export default class FakeMailTemplateProvider implements IMailTemplateProvider{
  async generate(data: IGenerateMailTemplateDTO): Promise<string> {
    return 'Template model';
  }
}
