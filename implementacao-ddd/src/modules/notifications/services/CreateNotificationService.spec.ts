import FakeNotificationsRepository from '../repositories/fakes/FakeNotificationsRepository';
import CreateNotificationService from './CreateNotificationService';

let notificationsRepository: FakeNotificationsRepository;
let createNotification: CreateNotificationService;

describe('NotificationService', () => {
  beforeEach(() => {
    notificationsRepository = new FakeNotificationsRepository();
    createNotification = new CreateNotificationService(notificationsRepository);
  });
  it('Deve criar uma notificação', async () => {
    const create = jest.spyOn(notificationsRepository, 'create');

    await createNotification.execute({
      recipientId: 'user-id',
      content: 'cool-message',
    });

    expect(create).toBeCalledWith({
      recipientId: 'user-id',
      content: 'cool-message',
    });
  });
});
