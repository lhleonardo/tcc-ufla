import { Router } from 'express';

import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthentication from '@modules/users/infra/http/middlewares/ensureAuthentication';
import AppointmentsController from '@modules/appointments/infra/http/controllers/AppointmentsController';
import ProviderAppointmentsController from '@modules/appointments/infra/http/controllers/ProviderAppointmentsController';
import FinishAppointmentController from '../controllers/FinishAppointmentController';
import { measureExecutionTime } from '@shared/infra/http/middlewares/measureExecutionTime';

const router = Router();
const appointmentsController = new AppointmentsController();
const finishAppointmentController = new FinishAppointmentController()
const providerAppointmentsController = new ProviderAppointmentsController();

// necessitam de autenticação
router.use(ensureAuthentication);

router.post(
  '/',
  celebrate({
    [Segments.BODY]: Joi.object({
      providerId: Joi.string().uuid().required(),
      date: Joi.date().required(),
    }).required(),
  }),
  measureExecutionTime("../execucoes/criar-agendamento-ddd.txt"),
  appointmentsController.create,
);

router.get(
  '/me',
  celebrate({
    [Segments.QUERY]: Joi.object({
      year: Joi.number().integer().required(),
      month: Joi.number().integer().min(1).max(12).required(),
      day: Joi.number().integer().min(1).max(31).required(),
    }).required(),
  }),
  measureExecutionTime("../execucoes/ver-agendamentos-ddd.txt"),
  providerAppointmentsController.index,
);

router.post(
  "/:id/finish",
  celebrate({
    [Segments.QUERY]: Joi.object({ id: Joi.string().uuid().required() })
  }),
  finishAppointmentController.create
);

export default router;
