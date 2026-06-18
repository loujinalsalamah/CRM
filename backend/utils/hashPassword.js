const bcrypt = require('bcrypt');

const hashPassword = (password) => bcrypt.hash(password, 12);

module.exports = hashPassword;
