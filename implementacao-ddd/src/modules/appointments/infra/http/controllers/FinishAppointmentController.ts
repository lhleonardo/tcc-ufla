import FinishAppointmentService from "@modules/appointments/services/FinishAppointmentService";
import { Request, Response } from "express"
import { container } from "tsyringe";

export default class FinishAppointmentController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { appointment_id: appointmentId } = request.body;

    const service: FinishAppointmentService = container.resolve(FinishAppointmentService);

    const result = await service.execute({ appointmentId });

    return response.json(result);
  }
}
