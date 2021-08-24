import uploadManagement from '@config/upload';

import { S3 as Storage } from 'aws-sdk';
import path from 'path';
import fs from 'fs';
import mime from 'mime';

import IStorageProvider from '../models/IStorageProvider';
import upload from '@config/upload';

export default class S3StorageProvider implements IStorageProvider {
  private client: Storage;

  constructor() {
    this.client = new Storage();
  }

  /**
   * Método que faz o upload de um arquivo no servidor da Amazon S3. Ele deve
   * realizar o upload para o bucket definido nas configurações globais em
   * `@config/upload.ts` e apagar o arquivo após a operação tiver sido realizada.
   *
   * As permissões do novo arquivo no S3 são de leitura aberta ao público.
   * @param file nome do arquivo no servidor da aplicação, convertido pelo multer
   */
  public async uploadFile(file: string): Promise<string> {
    const originalPath = path.resolve(uploadManagement.tmpFolder, file);

    // extrai o tipo de arquivo para info do S3
    const ContentType = mime.getType(originalPath);

    if (!ContentType) {
      throw new Error('File not found');
    }

    // faz a leitura do conteúdo para enviar um buffer com os dados
    const fileContent = await fs.promises.readFile(originalPath);

    // salva o arquivo no S3. O identificador do arquivo será o mesmo nome gerado
    // pelo multer no momento da realização do upload
    await this.client
      .putObject({
        Bucket: uploadManagement.config.aws.bucket,
        Key: file,
        ACL: 'public-read',
        Body: fileContent,
        ContentType,
      })
      .promise();

    // remove o arquivo do backend para evitar consumo desnecessário de disco
    await fs.promises.unlink(originalPath);

    return file;
  }

  /**
   * Método que apaga um arquivo permanentemente dentro do bucket do S3.
   * @param file nome do arquivo salvo no bucket
   */
  async deleteFile(file: string): Promise<void> {
    await this.client
      .deleteObject({
        Bucket: uploadManagement.config.aws.bucket,
        Key: file,
      })
      .promise();
  }
}
