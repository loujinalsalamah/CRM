const express = require('express');

const prisma = require('../../db');
const catchAsync = require('../../utils/catchAsync');
const validate = require('../../middlewares/validate');
const protect = require('../../middlewares/protect');
const restrictTo = require('../../middlewares/restrictTo');

const DealController = require('./deal.controller');
const DealService = require('./deal.service');
const DealRepository = require('./deal.repository');

const {
  createSaleLeaseDealSchema,
  createBuyRentDealSchema,
  dealIdSchema,
} = require('./deal.validation');

const NotificationService = require('../notifications/notification.service');
const NotificationRepository = require('../notifications/notification.repository');

const notificationRepository = new NotificationRepository(prisma);
const notificationService = new NotificationService(notificationRepository);

const dealRepository = new DealRepository(prisma);
const dealService = new DealService(dealRepository, notificationService);
const dealController = new DealController(dealService);

const scheduleRoutes = require('../schedules/schedule.routes');

const router = express.Router();

router.use(
  '/:dealId/schedules',
  catchAsync(protect),
  restrictTo('EMPLOYEE'),
  validate({ params: dealIdSchema }),
  scheduleRoutes,
);

router.post(
  '/saleLeaseDeal',
  catchAsync(protect),
  restrictTo('SALES_MANAGER'),
  validate({ body: createSaleLeaseDealSchema }),
  catchAsync(dealController.createSaleLeaseDeal),
);

router.post(
  '/buyRentDeal',
  catchAsync(protect),
  restrictTo('SALES_MANAGER'),
  validate({ body: createBuyRentDealSchema }),
  catchAsync(dealController.createBuyRentDeal),
);

router.get(
  '/:id',
  catchAsync(protect),
  restrictTo('EMPLOYEE'),
  validate({ params: dealIdSchema }),
  catchAsync(dealController.getDealById),
);

module.exports = router;
