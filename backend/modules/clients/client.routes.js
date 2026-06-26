const express = require('express');
const protect = require('../../middlewares/protect');
const restrictTo = require('../../middlewares/restrictTo');
const catchAsync = require('../../utils/catchAsync');
const validate = require('../../middlewares/validate');

const { updateMeSchema } = require('./client.validation');

const prisma = require('../../db');
const ClientRepository = require('./client.repository');
const ClientService = require('./client.service');
const ClientController = require('./client.controller');

const clientRepository = new ClientRepository(prisma);
const clientService = new ClientService(clientRepository);
const clientController = new ClientController(clientService);

const router = express.Router();

router.patch(
  '/updateMe',
  catchAsync(protect),
  restrictTo('CLIENT'),
  validate(updateMeSchema),
  catchAsync(clientController.updateMe),
);

module.exports = router;
