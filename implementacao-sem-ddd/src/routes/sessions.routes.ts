import SessionsController from '@controllers/users/SessionsController';
import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';

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
