import ProviderDayAvailabilityController from '@modules/appointments/infra/http/controllers/ProviderDayAvailabilityController';
import ProviderMonthAvailabilityController from '@modules/appointments/infra/http/controllers/ProviderMonthAvailabilityController';
import ProvidersController from '@modules/appointments/infra/http/controllers/ProvidersController';
import ensureAuthentication from '@modules/users/infra/http/middlewares/ensureAuthentication';
import { celebrate, Segments, Joi } from 'celebrate';

import { Router } from 'express';

const providersRouter = Router();
const providersController = new ProvidersController();

const monthAvailaibityController = new ProviderMonthAvailabilityController();
const dayAvailaibityController = new ProviderDayAvailabilityController();

providersRouter.use(ensureAuthentication);

providersRouter.get('/', providersController.index);

providersRouter.get(
  '/:providerId/month-availability',
  celebrate({
    [Segments.PARAMS]: {
      providerId: Joi.string().uuid().required(),
    },
    [Segments.QUERY]: {
      year: Joi.number().required(),
      month: Joi.number().required().min(1).max(12),
    },
  }),

  monthAvailaibityController.index,
);
providersRouter.get(
  '/:providerId/day-availability',
  celebrate({
    [Segments.PARAMS]: Joi.object({
      providerId: Joi.string().uuid().required(),
    }).required(),
    [Segments.QUERY]: Joi.object({
      day: Joi.number().required().min(1).max(31),
      year: Joi.number().required(),
      month: Joi.number().required().min(1).max(12),
    }).required(),
  }),
  dayAvailaibityController.index,
);

export default providersRouter;
