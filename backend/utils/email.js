const sendEmail = async (options) => {
  const url = 'https://api.brevo.com/v3/smtp/email';

  const payload = {
    sender: {
      name: 'CRM company',
      email: 'amjad.i.mahmoud1234@gmail.com',
    },
    to: [
      {
        email: options.email,
      },
    ],
    subject: options.subject,
    htmlContent: `<p>${options.message}</p>`,
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'api-key': process.env.BREVO_API_KEY,
      'content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `Brevo API Error: ${errorData.message || response.statusText}`,
    );
  }
};

module.exports = sendEmail;

// const nodemailer = require('nodemailer');

// const sendEmail = async (options) => {
//   const transporter = nodemailer.createTransport({
//     host: process.env.BREVO_HOST,
//     port: Number(process.env.BREVO_PORT),
//     secure: false,
//     auth: {
//       user: process.env.BREVO_USER,
//       pass: process.env.BREVO_PASS,
//     },
//   });

//   const mailOptions = {
//     from: `CRM company <amjad.i.mahmoud1234@gmail.com>`,
//     to: options.email,
//     subject: options.subject,
//     html: `<p>${options.message}</p>`,
//   };

//   await transporter.sendMail(mailOptions);
// };

// module.exports = sendEmail;
