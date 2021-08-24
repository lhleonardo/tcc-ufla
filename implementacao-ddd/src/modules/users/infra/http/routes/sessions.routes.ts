import { Router } from 'express';
import SessionsController from '@modules/users/infra/http/controllers/SessionsController';
import { celebrate, Segments, Joi } from 'celebrate';

const routes = Router();
const sessionsController = new SessionsController();

routes.post(
  '/',
  celebrate({
    [Segments.BODY]: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }).required(),
  }),
  sessionsController.generate,
);

export default routes;
