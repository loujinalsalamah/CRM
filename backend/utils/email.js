const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.BREVO_HOST,
    port: process.env.BREVO_PORT,
    auth: {
      user: process.env.BREVO_USER,
      pass: process.env.BREVO_PASS,
    },
  });

  const mailOptions = {
    from: `CRM company <amjad.i.mahmoud1234@gmail.com>`,
    to: options.email,
    subject: options.subject,
    html: `<p>${options.message}</p>`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
