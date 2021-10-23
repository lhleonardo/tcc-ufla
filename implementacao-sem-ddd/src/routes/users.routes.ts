import config from '@config/upload';
import UserAvatarController from '@controllers/users/UserAvatarController';
import UsersController from '@controllers/users/UsersController';
import ensureAuthentication from '@middlewares/ensureAuthentication';
import { measureExecutionTime } from '@middlewares/measureExecutionTime';
import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import multer from 'multer';

const routes = Router();
const upload = multer(config.multer);
const usersController = new UsersController();
const userAvatarController = new UserAvatarController();

routes.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      confirmPassword: Joi.string().required(),
    },
  }),
  measureExecutionTime("../execucoes/criar-conta-semddd.txt"),
  usersController.create,
);

routes.patch(
  '/avatar',
  ensureAuthentication,
  upload.single('avatar'),
  userAvatarController.update,
);

export default routes;
