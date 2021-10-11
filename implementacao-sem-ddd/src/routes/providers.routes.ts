import ProviderDayAvailabilityController from '@controllers/appointments/ProviderDayAvailabilityController';
import ProviderMonthAvailabilityController from '@controllers/appointments/ProviderMonthAvailabilityController';
import ProvidersController from '@controllers/appointments/ProvidersController';
import ensureAuthentication from '@middlewares/ensureAuthentication';
import { celebrate, Joi, Segments } from 'celebrate';
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
