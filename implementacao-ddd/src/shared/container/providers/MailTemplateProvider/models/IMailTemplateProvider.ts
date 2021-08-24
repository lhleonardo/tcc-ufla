import IGenerateMailTemplateDTO from "../dtos/IGenerateMailTemplateDTO";

export default interface IMailTemplateProvider {
  generate(data: IGenerateMailTemplateDTO): Promise<string>;
}
