import { inject, injectable } from 'tsyringe';
import Notification from '../infra/typeorm/schemas/Notification';
import INotificationsRepository from '../repositories/INotificationsRepository';

interface IRequest {
  recipientId: string;
  content: string;
}

@injectable()
class CreateNotificationService {
  constructor(
    @inject('NotificationRepository')
    private notificationRepository: INotificationsRepository,
  ) {}

  public execute({ recipientId, content }: IRequest): Promise<Notification> {
    return this.notificationRepository.create({ recipientId, content });
  }
}

export default CreateNotificationService;
