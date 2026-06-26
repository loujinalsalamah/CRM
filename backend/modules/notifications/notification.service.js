const { getIo } = require('../../socket/io');

class NotificationService {
  constructor(notificationRepository) {
    this.notificationRepository = notificationRepository;
  }

  async createNotification(data) {
    const notification =
      await this.notificationRepository.createNotification(data);

    if (notification.userId) {
      const io = getIo();
      io.to(`user_${notification.userId}`).emit('notification', notification);

      const unreadCount = await this.notificationRepository.getUnreadCount(
        notification.userId,
      );

      io.to(`user_${notification.userId}`).emit('unreadCount', unreadCount);
    }

    return notification;
  }

  getMyNotifications(userId, queryString) {
    return this.notificationRepository.findAllNotifications(
      userId,
      queryString,
    );
  }

  async markAsRead(id) {
    const notification = await this.notificationRepository.updateNotification(
      id,
      { isRead: true },
    );

    const unreadCount = await this.notificationRepository.getUnreadCount(
      notification.userId,
    );

    const io = getIo();
    io.to(`user_${notification.userId}`).emit('unreadCount', unreadCount);
    return notification;
  }

  async markAllAsRead(userId) {
    await this.notificationRepository.updateManyNotifications(userId, {
      isRead: true,
    });

    const io = getIo();
    io.to(`user_${userId}`).emit('unreadCount', 0);
  }

  getUnreadCount(userId) {
    return this.notificationRepository.getUnreadCount(userId);
  }
}

module.exports = NotificationService;
