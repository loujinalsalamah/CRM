const express = require('express');
const catchAsync = require('../../utils/catchAsync');
const validate = require('../../middlewares/validate');

const { createVisitorSessionSchema } = require('./visitor.validation');

const prisma = require('../../db');
const VisitorRepository = require('./visitor.repository');
const VisitorService = require('./visitor.service');
const VisitorController = require('./visitor.controller');

const visitorRepository = new VisitorRepository(prisma);
const visitorService = new VisitorService(visitorRepository);
const visitorController = new VisitorController(visitorService);

const router = express.Router();

router.post(
  '/',
  validate({ body: createVisitorSessionSchema }),
  catchAsync(visitorController.createVisitorSession),
);

module.exports = router;
