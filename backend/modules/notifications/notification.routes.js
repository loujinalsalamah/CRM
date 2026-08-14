const express = require('express');

const prisma = require('../../db');
const catchAsync = require('../../utils/catchAsync');
const protect = require('../../middlewares/protect');
const validate = require('../../middlewares/validate');

const NotificationController = require('./notification.controller');
const NotificationService = require('./notification.service');
const NotificationRepository = require('./notification.repository');
const {
  createNotification,
  notificationIdSchema,
} = require('./notification.validation');

const notificationRepository = new NotificationRepository(prisma);
const notificationService = new NotificationService(notificationRepository);
const notificationController = new NotificationController(notificationService);

const router = express.Router();

router.post(
  '/',
  validate({ body: createNotification }),
  catchAsync(notificationController.createNotification),
);

router.get(
  '/myNotifications',
  catchAsync(protect),
  catchAsync(notificationController.getMyNotifications),
);

router.patch(
  '/:id/read',
  catchAsync(protect),
  validate({ params: notificationIdSchema }),
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
