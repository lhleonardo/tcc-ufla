import { Router } from 'express';
import appointmentsRoutes from './appointments.routes';
import passwordRoutes from './passwords.routes';
import profileRoutes from './profile.routes';
import providersRouter from './providers.routes';
import sessionsRoutes from './sessions.routes';
import usersRoutes from './users.routes';

const routes = Router();

routes.use('/users', usersRoutes);
routes.use('/passwords', passwordRoutes);
routes.use('/sessions', sessionsRoutes);
routes.use('/profile', profileRoutes);

routes.use('/appointments', appointmentsRoutes);
routes.use('/providers', providersRouter);

export default routes;