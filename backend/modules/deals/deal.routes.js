const express = require('express');

const prisma = require('../../db');
const catchAsync = require('../../utils/catchAsync');
const validate = require('../../middlewares/validate');
const protect = require('../../middlewares/protect');
const restrictTo = require('../../middlewares/restrictTo');

const DealController = require('./deal.controller');
const DealService = require('./deal.service');
const DealRepository = require('./deal.repository');
const PropertyRepository = require('../properties/property.repository');
const EmployeeRepository = require('../employees/employee.repository');

const {
  createSaleLeaseDealSchema,
  createBuyRentDealSchema,
  dealIdSchema,
  changePropertySchema,
  changeEmployeeSchema,
} = require('./deal.validation');

const NotificationService = require('../notifications/notification.service');
const NotificationRepository = require('../notifications/notification.repository');

const notificationRepository = new NotificationRepository(prisma);
const notificationService = new NotificationService(notificationRepository);
const propertyRepository = new PropertyRepository(prisma);
const employeeRepository = new EmployeeRepository(prisma);
const dealRepository = new DealRepository(prisma);
const dealService = new DealService(
  dealRepository,
  notificationService,
  propertyRepository,
  employeeRepository,
);
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

router.patch(
  '/:id/changeProperty',
  catchAsync(protect),
  restrictTo('PURCHASING', 'RENTAL'),
  validate({ params: dealIdSchema, body: changePropertySchema }),
  catchAsync(dealController.changeProperty),
);

router.patch(
  '/:id/changeEmployee',
  catchAsync(protect),
  restrictTo('SALES_MANAGER'),
  validate({ params: dealIdSchema, body: changeEmployeeSchema }),
  catchAsync(dealController.changeEmployee),
);

module.exports = router;
