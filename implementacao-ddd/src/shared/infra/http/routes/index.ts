import { Router } from 'express';

import appointmentsRoutes from '@modules/appointments/infra/http/routes/appointments.routes';

import usersRoutes from '@modules/users/infra/http/routes/users.routes';
import sessionsRoutes from '@modules/users/infra/http/routes/sessions.routes';
import passwordRoutes from '@modules/users/infra/http/routes/passwords.routes';
import profileRoutes from '@modules/users/infra/http/routes/profile.routes';
import providersRouter from '@modules/appointments/infra/http/routes/providers.routes';

const routes = Router();

routes.use('/users', usersRoutes);
routes.use('/passwords', passwordRoutes);
routes.use('/sessions', sessionsRoutes);
routes.use('/profile', profileRoutes);

routes.use('/appointments', appointmentsRoutes);
routes.use('/providers', providersRouter);

export default routes;
