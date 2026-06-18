const APIFeatures = require('../../utils/apiFeatures');

class notificationRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  createNotification(data) {
    return this.prisma.notification.create({
      data,
    });
  }

  findAllNotifications(userId, queryString) {
    let features = new APIFeatures(queryString);

    features = features.filter();

    features = features.sort();

    features.options.where.userId = userId;

    if (features.options.where.isRead !== undefined) {
      features.options.where.isRead = features.options.where.isRead === 'true';
    }

    return this.prisma.notification.findMany(features.options);
  }

  updateNotification(id, data) {
    return this.prisma.notification.update({
      where: { id },
      data,
    });
  }

  updateManyNotifications(userId, data) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data,
    });
  }

  getUnreadCount(userId) {
    return this.prisma.notification.count({
      where: { userId, isRead: false },
    });
  }
}

module.exports = notificationRepository;
