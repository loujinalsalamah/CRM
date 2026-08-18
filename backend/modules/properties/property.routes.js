const express = require('express');

const prisma = require('../../db');
const catchAsync = require('../../utils/catchAsync');
const validate = require('../../middlewares/validate');
const protect = require('../../middlewares/protect');
const restrictTo = require('../../middlewares/restrictTo');

const PropertyController = require('./property.controller');
const PropertyService = require('./property.service');
const PropertyRepository = require('./property.repository');
const RequestRepository = require('../requests/request.repository');
const {
  createPropertySchema,
  propertyIdSchema,
  createPricingPolicySchema,
  updatePricingPolicySchema,
  pricingPolicyIdSchema,
} = require('./property.validation');

const requestRepository = new RequestRepository(prisma);

const propertyRepository = new PropertyRepository(prisma);
const propertyService = new PropertyService(
  propertyRepository,
  requestRepository,
);
const propertyController = new PropertyController(propertyService);

const router = express.Router();

router.get(
  '/pricingPolicies',
  catchAsync(protect),
  restrictTo('GENERAL_MANAGER', 'SALES_MANAGER'),
  catchAsync(propertyController.getPricingPolicy),
);

router.post(
  '/pricingPolicies',
  catchAsync(protect),
  restrictTo('GENERAL_MANAGER'),
  validate({ body: createPricingPolicySchema }),
  catchAsync(propertyController.createPricingPolicy),
);

router.patch(
  '/pricingPolicies/:id',
  catchAsync(protect),
  restrictTo('GENERAL_MANAGER'),
  validate({ params: pricingPolicyIdSchema, body: updatePricingPolicySchema }),
  catchAsync(propertyController.updatePricingPolicy),
);

router.post(
  '/',
  catchAsync(protect),
  restrictTo('CONSULTANT'),
  validate({ body: createPropertySchema }),
  catchAsync(propertyController.createProperty),
);

router.get('/', catchAsync(propertyController.getAllProperties));

router.get('/search', catchAsync(propertyController.searchProperties));

router.get(
  '/:id',
  validate({ params: propertyIdSchema }),
  catchAsync(propertyController.getProperty),
);

module.exports = router;
