const crypto = require('crypto');

const generateOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

  const expires = new Date(Date.now() + 5 * 60 * 1000);

  return { otp, hashedOtp, expires };
};

module.exports = generateOtp;
