import AppointmentsController from '@controllers/appointments/AppointmentsController';
import ProviderAppointmentsController from '@controllers/appointments/ProviderAppointmentsController';
import ensureAuthentication from '@middlewares/ensureAuthentication';
import { measureExecutionTime } from '@middlewares/measureExecutionTime';
import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';

const router = Router();
const appointmentsController = new AppointmentsController();
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
  measureExecutionTime("../execucoes/criar-agendamento-semddd.txt"),
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
  measureExecutionTime("../execucoes/ver-agendamentos-semddd.txt"),
  providerAppointmentsController.index,
);

export default router;
