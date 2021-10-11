import Notification from '@models/Notification';
import { ObjectID } from 'mongodb';
import ICreateNotificationDTO from '../dtos/ICreateNotificationDTO';
import INotificationsRepository from '../INotificationsRepository';

export default class FakeNotificationsRepository
  implements INotificationsRepository {
  private notifications: Notification[] = [];

  async create({
    recipientId,
    content,
  }: ICreateNotificationDTO): Promise<Notification> {
    const notification = new Notification();

    Object.assign(notification, { id: new ObjectID(), recipientId, content });

    this.notifications.push(notification);
    return notification;
  }
}
