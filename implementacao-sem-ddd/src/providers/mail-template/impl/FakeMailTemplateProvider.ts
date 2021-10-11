import IGenerateMailTemplateDTO from "../IGenerateMailTemplateDTO";
import IMailTemplateProvider from "../IMailTemplateProvider";

export default class FakeMailTemplateProvider implements IMailTemplateProvider {
  async generate(data: IGenerateMailTemplateDTO): Promise<string> {
    return 'Template model';
  }
}
