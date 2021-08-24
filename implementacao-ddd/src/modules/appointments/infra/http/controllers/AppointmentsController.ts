import { Response, Request } from 'express';
import { container } from 'tsyringe';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

export default class AppointmentsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { providerId, date } = request.body;
    const userId = request.user.id;

    const service = container.resolve(CreateAppointmentService);

    const result = await service.execute({
      providerId,
      userId,
      date,
    });

    return response.json(result);
  }
}
