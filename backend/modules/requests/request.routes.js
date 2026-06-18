const express = require('express');
const RequestController = require('./request.controller');
const RequestService = require('./request.service');
const RequestRepository = require('./request.repository');
const EmployeeRepository = require('../employees/employee.repository');
const catchAsync = require('../../utils/catchAsync');
const protect = require('../../middlewares/protect');
const restrictTo = require('../../middlewares/restrictTo');
const prisma = require('../../db');

const router = express.Router({ mergeParams: true });

const employeeRepository = new EmployeeRepository(prisma);
const requestRepository = new RequestRepository(prisma);
const requestService = new RequestService(
  requestRepository,
  employeeRepository,
);
const requestController = new RequestController(requestService);

router.post(
  '/',
  catchAsync(protect),
  restrictTo('CLIENT'),
  catchAsync(requestController.createRequest),
);

router.get(
  '/myRequests',
  catchAsync(protect),
  restrictTo('CONSULTANT'),
  catchAsync(requestController.getMyRequests),
);

router.get(
  '/:id',
  catchAsync(protect),
  restrictTo('CONSULTANT'),
  catchAsync(requestController.getRequestById),
);

module.exports = router;
