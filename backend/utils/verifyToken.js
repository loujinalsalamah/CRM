const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const verifyToken = (token) =>
  promisify(jwt.verify)(token, process.env.JWT_REFRESH_SECRET);

module.exports = verifyToken;
