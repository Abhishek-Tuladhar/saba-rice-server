const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  connectionTimeout: 10000, // 10s to establish connection
  greetingTimeout: 10000,   // 10s to receive server greeting
  socketTimeout: 10000,     // 10s of inactivity before giving up
});

const sendMail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"Saba Rice" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`Email sent successfully to ${to} — subject: "${subject}"`);
  } catch (err) {
    console.error(`Email send failed for ${to} (subject: "${subject}"):`, err.message);
  }
};

module.exports = sendMail;