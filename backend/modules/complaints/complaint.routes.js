const express = require('express');

const catchAsync = require('../../utils/catchAsync');
const validate = require('../../middlewares/validate');
const protect = require('../../middlewares/protect');
const restrictTo = require('../../middlewares/restrictTo');

const {
  createComplaintSchema,
  complaintIdSchema,
} = require('./complaint.validation');

const prisma = require('../../db');
const ComplaintRepository = require('./complaint.repository');
const ComplaintService = require('./complaint.service');
const ComplaintController = require('./complaint.controller');

const complaintRepository = new ComplaintRepository(prisma);
const complaintService = new ComplaintService(complaintRepository);
const complaintController = new ComplaintController(complaintService);

const router = express.Router();

router.post(
  '/',
  catchAsync(protect),
  restrictTo('CLIENT', 'EMPLOYEE'),
  validate({ body: createComplaintSchema }),
  catchAsync(complaintController.createComplaint),
);

router.get(
  '/',
  catchAsync(protect),
  restrictTo('SUPPORT'),
  catchAsync(complaintController.getAllComplaints),
);

router.get(
  '/:id',
  catchAsync(protect),
  restrictTo('SUPPORT'),
  validate({ params: complaintIdSchema }),
  catchAsync(complaintController.getComplaintById),
);

// router.patch(
//   '/:id/reply',
//   catchAsync(protect),
//   restrictTo('SUPPORT'),
//   validate({ params: complaintIdSchema }),
//   catchAsync(complaintController.replyToComplaint),
// );

// router.patch(
//   '/:id/resolve',
//   catchAsync(protect),
//   restrictTo('SUPPORT'),
//   validate({ params: complaintIdSchema }),
//   catchAsync(complaintController.resolveToComplaint),
// );

module.exports = router;
