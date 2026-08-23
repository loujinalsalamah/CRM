const express = require('express');
const catchAsync = require('../../utils/catchAsync');
const validate = require('../../middlewares/validate');

const { createLeadSchema, updateLeadSchema } = require('./lead.validation');

const prisma = require('../../db');
const LeadRepository = require('./lead.repository');
const LeadService = require('./lead.service');
const LeadController = require('./lead.controller');

const leadRepository = new LeadRepository(prisma);
const leadService = new LeadService(leadRepository);
const leadController = new LeadController(leadService);

const router = express.Router();

router.post(
  '/',
  validate({ body: createLeadSchema }),
  catchAsync(leadController.createLead),
);

router.patch(
  '/',
  validate({ body: updateLeadSchema }),
  catchAsync(leadController.updateLead),
);

module.exports = router;
