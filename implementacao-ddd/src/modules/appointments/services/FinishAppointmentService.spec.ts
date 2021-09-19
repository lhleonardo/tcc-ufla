import AppError from "@shared/errors/AppError";
import FakeAppointmentRepository from "../repositories/fakes/FakeAppointmentsRepository";
import FinishAppointmentService from "./FinishAppointmentService";


let service: FinishAppointmentService
let repository: FakeAppointmentRepository


describe("FinishAppointmentService", () => {
  beforeEach(() => {
    repository = new FakeAppointmentRepository();
    service = new FinishAppointmentService(repository);
  })

  it("Não deve finalizar um agendamento que não existe", async () => {
    const finishedAppointment = service.execute({appointmentId: 'invalid appointment id'});

    expect(finishedAppointment).rejects.toBeInstanceOf(AppError);
  })

  it("Não deve finalizar um agendamento que já foi finalizado", async () => {
    const appointment = await repository.create({
      providerId: 'valid_provider_id',
      userId: 'valid_user_id',
      date: new Date()
    })

    await service.execute({appointmentId: appointment.id})

    const finishedAppointment = service.execute({appointmentId: appointment.id});

    expect(finishedAppointment).rejects.toBeInstanceOf(AppError);
  })

  it('Deve finalizar um agendamento', async () => {
    const appointment = await repository.create({
      providerId: 'valid_provider_id',
      userId: 'valid_user_id',
      date: new Date()
    })

    const finishedAppointment = await service.execute({appointmentId: appointment.id})

    expect(finishedAppointment).toBeTruthy()
    expect(finishedAppointment.finishDate).toBeTruthy()
  })
})
