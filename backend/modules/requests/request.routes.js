const express = require('express');
const RequestController = require('./request.controller');
const RequestService = require('./request.service');
const RequestRepository = require('./request.repository');
const EmployeeRepository = require('../employees/employee.repository');
const PropertyRepository = require('../properties/property.repository');
const catchAsync = require('../../utils/catchAsync');
const protect = require('../../middlewares/protect');
const restrictTo = require('../../middlewares/restrictTo');
const prisma = require('../../db');

const router = express.Router({ mergeParams: true });

const employeeRepository = new EmployeeRepository(prisma);
const requestRepository = new RequestRepository(prisma);
const propertyRepository = new PropertyRepository(prisma);
const requestService = new RequestService(
  requestRepository,
  employeeRepository,
  propertyRepository,
);
const requestController = new RequestController(requestService);

router.post(
  '/sellRequest',
  catchAsync(protect),
  restrictTo('CLIENT'),
  catchAsync(requestController.createSellRequest),
);

router.post(
  '/buyRequest',
  catchAsync(protect),
  restrictTo('CLIENT'),
  catchAsync(requestController.createBuyRequest),
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
  catchAsync(requestController.getRequestById),
);

module.exports = router;
