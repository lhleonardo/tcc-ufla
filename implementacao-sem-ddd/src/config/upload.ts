import multer, { StorageEngine } from 'multer';
import path from 'path';
import crypto from 'crypto';

/**
 * Configuração de upload de imagens para a API.
 *
 * Todos os arquivos enviados estarão na pasta tmp,
 * presente na raíz do projeto.
 *
 * O nome de cada um dos arquivos será renomeado para o formato:
 * hash_aleatorio-nome_arquivo_original.extensao
 */

interface IUploadConfig {
  driver: 's3' | 'disk';

  tmpFolder: string;
  uploadFolder: string;

  multer: {
    storage: StorageEngine;
  };

  config: {
    generateURL: (file: string) => string;
    disk: {};
    aws: {
      bucket: string;
    };
  };
}

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  driver: process.env.STORAGE_DRIVER ?? 'disk',

  tmpFolder,
  uploadFolder: path.resolve(tmpFolder, 'uploads'),

  multer: {
    storage: multer.diskStorage({
      destination: tmpFolder,
      filename: (_, file, callback) => {
        const fileHash = crypto.randomBytes(10).toString('hex');
        const fileName = `${fileHash}-${file.originalname}`;

        return callback(null, fileName);
      },
    }),
  },

  config: {
    disk: {},
    aws: {
      bucket: process.env.STORAGE_AWS_BUCKET,
    },

    generateURL: file => {
      let url = process.env.STORAGE_URL;
      if (process.env.STORAGE_DRIVER === 's3') {
        url = url
          .replace('{bucket}', process.env.STORAGE_AWS_BUCKET)
          .replace('{region}', process.env.AMAZON_REGION);
      }
      return `${url}${file}`;
    },
  },
} as IUploadConfig;
