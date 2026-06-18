const express = require('express');

const catchAsync = require('../../utils/catchAsync');
const validate = require('../../middlewares/validate');
const protect = require('../../middlewares/protect');
const restrictTo = require('../../middlewares/restrictTo');

const {
  createScheduleSchema,
  scheduleIdSchema,
  updateScheduleSchema,
  cancelScheduleSchema,
  completeScheduleSchema,
} = require('./schedule.validation');

const prisma = require('../../db');
const ScheduleRepository = require('./schedule.repository');
const ScheduleService = require('./schedule.service');
const ScheduleController = require('./schedule.controller');

const scheduleRepository = new ScheduleRepository(prisma);

const scheduleService = new ScheduleService(scheduleRepository);
const scheduleController = new ScheduleController(scheduleService);

const router = express.Router();

router.post(
  '/',
  catchAsync(protect),
  restrictTo('EMPLOYEE'),
  validate({ body: createScheduleSchema }),
  catchAsync(scheduleController.createSchedule),
);

router.get(
  '/:id',
  catchAsync(protect),
  restrictTo('EMPLOYEE'),
  validate({ params: scheduleIdSchema }),
  catchAsync(scheduleController.getSchedule),
);

router.patch(
  '/:id',
  validate({ params: scheduleIdSchema, body: updateScheduleSchema }),
  catchAsync(scheduleController.updateSchedule),
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

router.patch(
  '/:id/cancel',
  catchAsync(protect),
  restrictTo('EMPLOYEE'),
  validate({ params: scheduleIdSchema, body: cancelScheduleSchema }),
  catchAsync(scheduleController.cancelSchedule),
);

router.patch(
  '/:id/complete',
  catchAsync(protect),
  restrictTo('EMPLOYEE'),
  validate({ params: scheduleIdSchema, body: completeScheduleSchema }),
  catchAsync(scheduleController.completeSchedule),
);

module.exports = router;
