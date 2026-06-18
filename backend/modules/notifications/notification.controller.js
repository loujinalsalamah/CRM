const AppError = require('../../utils/appError');

class NotificationController {
  constructor(notificationService) {
    this.notificationService = notificationService;

    this.createNotification = this.createNotification.bind(this);
    this.getMyNotifications = this.getMyNotifications.bind(this);
    this.markAsRead = this.markAsRead.bind(this);
    this.markAllAsRead = this.markAllAsRead.bind(this);
    this.getUnreadCount = this.getUnreadCount.bind(this);
  }

  async createNotification(req, res, next) {
    const data = req.body;
    const notification =
      await this.notificationService.createNotification(data);

    if (!notification) {
      return next(new AppError('Failed to create notification', 404));
    }

    res.status(201).json({
      status: 'success',
      data: notification,
    });
  }

  async getMyNotifications(req, res, next) {
    const userId = req.user.id;
    const queryString = req.query;

    const notifications = await this.notificationService.getMyNotifications(
      userId,
      queryString,
    );

    res.status(200).json({
      status: 'success',
      results: notifications.length,
      data: notifications,
    });
  }

  async markAsRead(req, res, next) {
    const { id } = req.params;

    await this.notificationService.markAsRead(id);

    res.status(200).json({
      status: 'success',
      message: 'Notification marked as read',
    });
  }

  async markAllAsRead(req, res, next) {
    const userId = req.user.id;

    await this.notificationService.markAllAsRead(userId);

    res.status(200).json({
      status: 'success',
      message: 'All notifications marked as read',
    });
  }

  async getUnreadCount(req, res, next) {
    const userId = req.user.id;
    const count = await this.notificationService.getUnreadCount(userId);

    res.status(200).json({
      status: 'success',
      data: count,
    });
  }
}
module.exports = NotificationController;
