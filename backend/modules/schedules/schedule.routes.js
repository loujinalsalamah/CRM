const express = require('express');

const catchAsync = require('../../utils/catchAsync');
const validate = require('../../middlewares/validate');
const protect = require('../../middlewares/protect');
const restrictTo = require('../../middlewares/restrictTo');

const {
  createScheduleSchema,
  scheduleIdSchema,
} = require('./schedule.validation');

const prisma = require('../../db');
const ScheduleRepository = require('./schedule.repository');
const NotificationRepository = require('../notifications/notification.repository');
const NotificationService = require('../notifications/notification.service');
const ScheduleService = require('./schedule.service');
const ScheduleController = require('./schedule.controller');

const scheduleRepository = new ScheduleRepository(prisma);
const notificationRepository = new NotificationRepository(prisma);
const notificationService = new NotificationService(notificationRepository);
const scheduleService = new ScheduleService(
  scheduleRepository,
  notificationService,
);
const scheduleController = new ScheduleController(scheduleService);

const router = express.Router({ mergeParams: true });

router.get(
  '/',
  catchAsync(protect),
  restrictTo('EMPLOYEE'),
  (req, res, next) => {
    if (req.params.id) return next();
    return scheduleController.getMySchedules(req, res, next);
  },
);

// router.get(
//   '/',
//   catchAsync(protect),
//   restrictTo('EMPLOYEE'),
//   catchAsync(scheduleController.getDealSchedules),
// );

router.post(
  '/',
  catchAsync(protect),
  restrictTo('EMPLOYEE'),
  validate({ body: createScheduleSchema }),
  catchAsync(scheduleController.createSchedule),
);
router.delete(
  '/:id',
  catchAsync(protect),
  restrictTo('EMPLOYEE'),
  validate({ params: scheduleIdSchema }),
  catchAsync(scheduleController.deleteSchedule),
);

router.patch(
  '/:id/accept',
  catchAsync(protect),
  restrictTo('CLIENT'),
  validate({ params: scheduleIdSchema }),
  catchAsync(scheduleController.acceptSchedule),
);

router.patch(
  '/:id/reject',
  catchAsync(protect),
  restrictTo('CLIENT'),
  validate({ params: scheduleIdSchema }),
  catchAsync(scheduleController.rejectSchedule),
);

module.exports = router;
