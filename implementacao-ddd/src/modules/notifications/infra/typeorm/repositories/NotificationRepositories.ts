import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import { getMongoRepository, MongoRepository } from 'typeorm';
import Notification from '../schemas/Notification';

class NotificationsRepository implements INotificationsRepository {
  private ormRepository: MongoRepository<Notification>;

  constructor() {
    this.ormRepository = getMongoRepository(Notification, 'mongo');
  }
  public async create({
    recipientId,
    content,
  }: ICreateNotificationDTO): Promise<Notification> {
    const notification = this.ormRepository.create({ recipientId, content });

    await this.ormRepository.save(notification);

    return notification;
  }
}

export default NotificationsRepository;
