import IGenerateMailTemplateDTO from '../dtos/IGenerateMailTemplateDTO';
import IMailTemplateProvider from '../models/IMailTemplateProvider';

import fs from 'fs';

import handlebars from 'handlebars';

class HandlebarsMailTemplateProvider implements IMailTemplateProvider {
  async generate({
    file,
    variables,
  }: IGenerateMailTemplateDTO): Promise<string> {
    const templateFile = await fs.promises.readFile(file, {
      encoding: 'utf-8',
    });

    const template = handlebars.compile(templateFile);

    return template(variables ?? {});
  }
}

export default HandlebarsMailTemplateProvider;
