// backend/utils/mailer.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

let transport;

if (process.env.NODE_ENV === "development") {
  const t = await nodemailer.createTestAccount();
  transport = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: t,
  });
  console.log("Ethereal inbox:", t.user);
} else {
  transport = nodemailer.createTransport({
    host: "smtp.sendgrid.net",
    port: 465,
    secure: true,
    auth: {
      user: "apikey",
      pass: process.env.SMTP_PASS,
    },
  });
}

transport.defaults = {
  from: '"Dresses Fashion Store" <dressesfashionstore@gmail.com>',
};

export default transport;
