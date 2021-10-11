import ForgotPasswordController from '@controllers/users/ForgotPasswordController';
import ResetPasswordController from '@controllers/users/ResetPasswordController';
import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';

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
