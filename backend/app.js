const express = require('express');
const morgan = require('morgan');

const app = express();

if (process.env.NODE_ENV === 'devlopment') {
  app.use(morgan('dev'));
}
app.use(express.json());

module.exports = app;
