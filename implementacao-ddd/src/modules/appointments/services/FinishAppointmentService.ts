import AppError from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";
import Appointment from "../infra/typeorm/entities/Appointment";
import IAppointmentRepository from "../repositories/IAppointmentRepository";


export interface IRequest {
  appointmentId: string;
}

@injectable()
export default class FinishAppointmentService {

  constructor(
    @inject("IAppointmentRepository")
    private readonly repository: IAppointmentRepository
  ) { }


  public async execute({ appointmentId }: IRequest): Promise<Appointment> {
    const checkAppointmentExists = await this.repository.findById(appointmentId);

    if (!checkAppointmentExists) {
      throw new AppError("Invalid appointment does not exists", 404)
    }

    if (checkAppointmentExists.finishDate) {
      throw new AppError("This appointment has already been finished")
    }

    const finished = await this.repository.finish(checkAppointmentExists.id);

    return finished
  }
}
