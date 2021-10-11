import FakeNotificationsRepository from '@repositories/fakes/FakeNotificationsRepository';
import NotificationService from '@services/notification.service';

let notificationsRepository: FakeNotificationsRepository;
let createNotification: NotificationService;

describe('NotificationService', () => {
  beforeEach(() => {
    notificationsRepository = new FakeNotificationsRepository();
    createNotification = new NotificationService(notificationsRepository);
  });
  it('Deve criar uma notificação', async () => {
    const create = jest.spyOn(notificationsRepository, 'create');

    await createNotification.create({
      recipientId: 'user-id',
      content: 'cool-message',
    });

    expect(create).toBeCalledWith({
      recipientId: 'user-id',
      content: 'cool-message',
    });
  });
});
