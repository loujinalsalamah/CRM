const express = require('express');

const prisma = require('../../db');
const catchAsync = require('../../utils/catchAsync');
const protect = require('../../middlewares/protect');
const restrictTo = require('../../middlewares/restrictTo');

const DashboardController = require('./dashboard.controller');
const DashboardService = require('./dashboard.service');
const DashboardRepository = require('./dashboard.repository');

const dashboardRepository = new DashboardRepository(prisma);
const dashboardService = new DashboardService(dashboardRepository);
const dashboardController = new DashboardController(dashboardService);

const router = express.Router();

router.get(
  '/',
  catchAsync(protect),
  restrictTo('SALES_MANAGER'),
  catchAsync(dashboardController.getDashboard),
);

module.exports = router;
