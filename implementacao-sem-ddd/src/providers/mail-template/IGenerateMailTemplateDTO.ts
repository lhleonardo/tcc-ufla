interface IGenerateVariableType {
  [key: string]: string | number;
}
export default interface IGenerateMailTemplateDTO {
  file: string;
  variables?: IGenerateVariableType;
}
