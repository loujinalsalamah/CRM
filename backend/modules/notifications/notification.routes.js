const express = require('express');

const NotificationController = require('./notification.controller');
const NotificationService = require('./notification.service');
const NotificationRepository = require('./notification.repository');
const catchAsync = require('../../utils/catchAsync');
const prisma = require('../../db');
const protect = require('../../middlewares/protect');

const router = express.Router();

const notificationRepository = new NotificationRepository(prisma);
const notificationService = new NotificationService(notificationRepository);
const notificationController = new NotificationController(notificationService);

router.post('/', catchAsync(notificationController.createNotification));

router.get(
  '/myNotifications',
  catchAsync(protect),
  catchAsync(notificationController.getMyNotifications),
);

router.patch(
  '/:id/read',
  catchAsync(protect),
  catchAsync(notificationController.markAsRead),
);

router.patch(
  '/readAll',
  catchAsync(protect),
  catchAsync(notificationController.markAllAsRead),
);

router.get(
  '/countUnRead',
  catchAsync(protect),
  catchAsync(notificationController.getUnreadCount),
);

module.exports = router;
