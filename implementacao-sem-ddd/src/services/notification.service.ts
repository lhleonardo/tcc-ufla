import { inject, injectable } from 'tsyringe';

import INotificationsRepository from '@repositories/INotificationsRepository';
import ICreateNotificationDTO from '@repositories/dtos/ICreateNotificationDTO';
import Notification from '@models/Notification';

@injectable()
class NotificationService {
  constructor(
    @inject('NotificationRepository')
    private notificationRepository: INotificationsRepository,
  ) {}

  public create({
    recipientId,
    content,
  }: ICreateNotificationDTO): Promise<Notification> {
    return this.notificationRepository.create({ recipientId, content });
  }
}

export default NotificationService;
