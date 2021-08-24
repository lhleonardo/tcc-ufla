import { Router } from 'express';
import ForgotPasswordController from '@modules/users/infra/http/controllers/ForgotPasswordController';
import ResetPasswordController from '@modules/users/infra/http/controllers/ResetPasswordController';

import { celebrate, Segments, Joi } from 'celebrate';

const passwordRoutes = Router();

const forgotController = new ForgotPasswordController();
const resetController = new ResetPasswordController();

passwordRoutes.post(
  '/forgot',
  celebrate({
    [Segments.BODY]: Joi.object({
      email: Joi.string().email().required(),
    }).required(),
  }),
  forgotController.store,
);
passwordRoutes.post(
  '/reset',
  celebrate({
    [Segments.BODY]: Joi.object({
      token: Joi.string().uuid().required(),
      password: Joi.string().required(),
      confirmPassword: Joi.string().required().valid(Joi.ref('password')),
    }).required(),
  }),
  resetController.store,
);

export default passwordRoutes;
