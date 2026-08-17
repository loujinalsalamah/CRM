const express = require('express');

const catchAsync = require('../../utils/catchAsync');
// const validate = require('../../middlewares/validate');
const protect = require('../../middlewares/protect');
const restrictTo = require('../../middlewares/restrictTo');

const scheduleRoutes = require('../schedules/schedule.routes');

const router = express.Router();

router.get(
  '/:id/schedules',
  catchAsync(protect),
  restrictTo('EMPLOYEE'),
  //   validate({ params: dealIdSchema }),
  scheduleRoutes,
);

module.exports = router;
