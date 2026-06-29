const express = require('express');
const protect = require('../../middlewares/protect');
const restrictTo = require('../../middlewares/restrictTo');
const catchAsync = require('../../utils/catchAsync');
const validate = require('../../middlewares/validate');

const { updateMeSchema, favoriteIdSchema } = require('./client.validation');

const prisma = require('../../db');
const PropertyRepository = require('../properties/property.repository');
const ClientRepository = require('./client.repository');
const ClientService = require('./client.service');
const ClientController = require('./client.controller');

const propertyRepository = new PropertyRepository(prisma);
const clientRepository = new ClientRepository(prisma);
const clientService = new ClientService(clientRepository, propertyRepository);
const clientController = new ClientController(clientService);

const router = express.Router();

router.patch(
  '/updateMe',
  catchAsync(protect),
  restrictTo('CLIENT'),
  validate({ body: updateMeSchema }),
  catchAsync(clientController.updateMe),
);

router.get(
  '/favorite',
  catchAsync(protect),
  restrictTo('CLIENT'),
  catchAsync(clientController.getMyFavorite),
);

router.post(
  '/favorite',
  catchAsync(protect),
  restrictTo('CLIENT'),
  validate({ body: favoriteIdSchema }),
  catchAsync(clientController.addToFavorite),
);

router.delete(
  '/favorite',
  catchAsync(protect),
  restrictTo('CLIENT'),
  validate({ body: favoriteIdSchema }),
  catchAsync(clientController.removeFromFavorite),
);

module.exports = router;
