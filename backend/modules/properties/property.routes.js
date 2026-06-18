const express = require('express');

const PropertyController = require('./property.controller');
const PropertyService = require('./property.service');
const PropertyRepository = require('./property.repository');
const RequestRepository = require('../requests/request.repository');
const catchAsync = require('../../utils/catchAsync');
const prisma = require('../../db');
const protect = require('../../middlewares/protect');
const restrictTo = require('../../middlewares/restrictTo');

const router = express.Router();

const requestRepository = new RequestRepository(prisma);

const propertyRepository = new PropertyRepository(prisma);
const propertyService = new PropertyService(
  propertyRepository,
  requestRepository,
);
const propertyController = new PropertyController(propertyService);

router.post(
  '/',
  catchAsync(protect),
  restrictTo('CONSULTANT'),
  catchAsync(propertyController.createProperty),
);

router.get('/', catchAsync(propertyController.getAllProperties));

router.get('/search', catchAsync(propertyController.searchProperties));

router.get('/:id', catchAsync(propertyController.getProperty));

module.exports = router;
