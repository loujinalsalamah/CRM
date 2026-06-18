class NotificationService {
  constructor(notificationRepository) {
    this.notificationRepository = notificationRepository;
  }

  createNotification(data) {
    return this.notificationRepository.createNotification(data);
  }

  getMyNotifications(userId, queryString) {
    return this.notificationRepository.findAllNotifications({
      userId,
      queryString,
    });
  }

  markAsRead(id) {
    return this.notificationRepository.updateNotification(id, { isRead: true });
  }

  markAllAsRead(userId) {
    return this.notificationRepository.updateManyNotifications(userId, {
      isRead: true,
    });
  }

  getUnreadCount(userId) {
    return this.notificationRepository.getUnreadCount(userId);
  }
}

module.exports = NotificationService;
