const express = require('express');

const catchAsync = require('../../utils/catchAsync');
const validate = require('../../middlewares/validate');
const protect = require('../../middlewares/protect');
const restrictTo = require('../../middlewares/restrictTo');

const { createEmployeeSchema } = require('./employee.validation');

const prisma = require('../../db');
const EmployeeRepository = require('./employee.repository');
const EmployeeService = require('./employee.service');
const EmployeeController = require('./employee.controller');

const employeeRepository = new EmployeeRepository(prisma);
const employeeService = new EmployeeService(employeeRepository);
const employeeController = new EmployeeController(employeeService);

const router = express.Router();

router.post(
  '/',
  catchAsync(protect),
  restrictTo('GENERAL_MANAGER'),
  validate({ body: createEmployeeSchema }),
  catchAsync(employeeController.createEmployee),
);

router.get(
  '/',
  catchAsync(protect),
  restrictTo('GENERAL_MANAGER'),
  validate({ body: createEmployeeSchema }),
  catchAsync(employeeController.createEmployee),
);

module.exports = router;
