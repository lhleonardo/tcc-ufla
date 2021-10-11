import IGenerateMailTemplateDTO from "./IGenerateMailTemplateDTO";

export default interface IMailTemplateProvider {
  generate(data: IGenerateMailTemplateDTO): Promise<string>;
}
