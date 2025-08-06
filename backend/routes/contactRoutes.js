import express from "express";
import mailer from "../utils/mailer.js";

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    await mailer.sendMail({
      from: '"Website Feedback" <dressesfashionstore@gmail.com>',
      to: "dressesfashionstore@gmail.com",
      subject: `Feedback: ${subject}`,
      html: `
        <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong><br>${message.replace(/\n/g, "<br/>")}</p>
      `,
    });

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

export default router;
