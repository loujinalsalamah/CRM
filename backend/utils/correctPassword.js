const bcrypt = require('bcrypt');

const correctPassword = (candidatePassword, userPassword) =>
  bcrypt.compare(candidatePassword, userPassword);

module.exports = correctPassword;
