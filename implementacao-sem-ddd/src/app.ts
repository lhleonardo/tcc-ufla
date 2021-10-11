import uploadConfig from '@config/upload';
import AppError from '@errors/AppError';
import rateLimiter from '@middlewares/rateLimiter';
import routes from '@routes/index';

import "@providers/index"
import "@database/index"

import { errors } from 'celebrate';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';

const app = express();

// corpo da requisição sempre convertido para json
app.use(cors());
app.use(express.json());
// rota estática para acessar arquivos que foram enviados
app.use('/files', express.static(uploadConfig.uploadFolder));
app.use(rateLimiter);
app.use(routes);

app.use(errors());

app.use(
  (error: Error, request: Request, response: Response, _: NextFunction) => {
    if (error instanceof AppError) {
      return response
        .status(error.statusCode)
        .json({ status: 'error', message: error.message });
    }

    return response
      .status(500)
      .json({ status: 'error', message: 'Internal Server Error' });
  },
);

export default app;
