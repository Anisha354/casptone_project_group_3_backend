// backend/utils/mailer.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

let transporter;

if (process.env.NODE_ENV === "development") {
  // Dev: Ethereal
  const testAccount = await nodemailer.createTestAccount();
  transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
  console.log("🧪  Using Ethereal SMTP for development");
} else {
  // Prod: SendGrid SMTP via env-vars
  const host = process.env.SMTP_HOST;      // e.g. smtp.sendgrid.net
  const port = Number(process.env.SMTP_PORT); // e.g. 465
  const user = process.env.SMTP_USER;      // should be "apikey"
  const pass = process.env.SMTP_PASS;      // your SendGrid API key

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
  console.log(`📬  Using SMTP ${host}:${port} user=${user}`);
}

// Global default `from:` (override via SMTP_FROM)
transporter.defaults = {
  from:
    process.env.SMTP_FROM ||
    '"Dresses Fashion Store" <dressesfashionstore@gmail.com>',
};

// Verify connection configuration immediately
transporter.verify((err, success) => {
  if (err) {
    console.error("❌  SMTP configuration is invalid:", err);
  } else {
    console.log("✅  SMTP transporter is ready to send emails");
  }
});

export default transporter;
