import { Router } from 'express';

import ensureAuthentication from '../middlewares/ensureAuthentication';

import ProfileController from '@modules/users/infra/http/controllers/ProfileController';
import { celebrate, Segments, Joi } from 'celebrate';

const profileController = new ProfileController();
const profileRoutes = Router();

profileRoutes.use(ensureAuthentication);

profileRoutes.get(
  '/',
  celebrate({
    [Segments.BODY]: {
      userId: Joi.string().uuid().required(),
    },
  }),
  profileController.show,
);
profileRoutes.put(
  '/',
  celebrate({
    [Segments.BODY]: Joi.object()
      .keys({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        oldPassword: Joi.string(),
        password: Joi.string(),
        confirmPassword: Joi.string(),
      })
      .with('oldPassword', ['password', 'confirmPassword'])
      .required(),
  }),
  profileController.update,
);

export default profileRoutes;
