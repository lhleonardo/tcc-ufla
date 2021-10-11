import Notification from '@models/Notification';
import ICreateNotificationDTO from '@repositories/dtos/ICreateNotificationDTO';
import INotificationsRepository from '@repositories/INotificationsRepository';
import { getMongoRepository, MongoRepository } from 'typeorm';

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
