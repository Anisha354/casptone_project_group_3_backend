// backend/utils/mailer.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

let transport;

if (process.env.NODE_ENV === "development") {
  // ── Development: Ethereal test account ─────────────────
  const testAccount = await nodemailer.createTestAccount();
  console.log("🧪  Ethereal test account:", testAccount);

  transport = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
} else {
  // ── Production: your SendGrid SMTP ──────────────────────
  const host = process.env.SMTP_HOST;     // smtp.sendgrid.net
  const port = parseInt(process.env.SMTP_PORT, 10); // 465
  const user = process.env.SMTP_USER;     // apikey
  const pass = process.env.SMTP_PASS;     // SG.xxxx…

  // sanity check
  if (!host || !port || !user || !pass) {
    console.error(
      "🚨 SMTP config missing! Please set SMTP_HOST, SMTP_PORT, SMTP_USER & SMTP_PASS"
    );
  }

  transport = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false otherwise
    auth: { user, pass },
  });
}

// set a global default `from:` address, override with SMTP_FROM if you like
transport.defaults = {
  from:
    process.env.SMTP_FROM ||
    '"Dresses Fashion Store" <dressesfashionstore@gmail.com>',
};

export default transport;
