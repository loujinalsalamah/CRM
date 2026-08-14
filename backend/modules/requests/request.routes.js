const express = require('express');

const catchAsync = require('../../utils/catchAsync');
const protect = require('../../middlewares/protect');
const restrictTo = require('../../middlewares/restrictTo');
const validate = require('../../middlewares/validate');
const prisma = require('../../db');

const {
  sellRequestSchema,
  buyRequestSchema,
  requestIdSchema,
} = require('./request.validation');

const RequestController = require('./request.controller');
const RequestService = require('./request.service');
const RequestRepository = require('./request.repository');

const EmployeeRepository = require('../employees/employee.repository');

const PropertyRepository = require('../properties/property.repository');

const employeeRepository = new EmployeeRepository(prisma);

const propertyRepository = new PropertyRepository(prisma);

const requestRepository = new RequestRepository(prisma);
const requestService = new RequestService(
  requestRepository,
  employeeRepository,
  propertyRepository,
);
const requestController = new RequestController(requestService);

const router = express.Router({ mergeParams: true });

router.post(
  '/sellRequest',
  catchAsync(protect),
  restrictTo('CLIENT'),
  validate({ body: sellRequestSchema }),
  catchAsync(requestController.createSellRequest),
);

router.post(
  '/buyRequest',
  catchAsync(protect),
  restrictTo('CLIENT'),
  validate({ body: buyRequestSchema }),
  catchAsync(requestController.createBuyRequest),
);

router.get(
  '/',
  catchAsync(protect),
  restrictTo('SALES_MANAGER'),
  catchAsync(requestController.getAllRequests),
);

router.get(
  '/myRequests',
  catchAsync(protect),
  restrictTo('CONSULTANT'),
  catchAsync(requestController.getMyRequests),
);

router.get(
  '/stats',
  catchAsync(protect),
  restrictTo('CONSULTANT'),
  catchAsync(requestController.getRequestsStats),
);

router.get(
  '/:id',
  catchAsync(protect),
  restrictTo('CONSULTANT'),
  validate({ params: requestIdSchema }),
  catchAsync(requestController.getRequestById),
);

module.exports = router;
