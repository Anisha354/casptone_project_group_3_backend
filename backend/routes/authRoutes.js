// src/routes/authRoutes.js
import express from "express";
import rateLimit from "express-rate-limit";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import PasswordResetToken from "../models/PasswordResetToken.js";
import User from "../models/user.js";
import mailer from "../utils/mailer.js";
import { createError } from "../error.js";

const router = express.Router();
const limiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 5 });
const FRONTEND = process.env.FRONTEND_ORIGIN || "https://casptone-project-group-3-frontend.onrender.com";

router.post("/forgot", limiter, async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) return res.json({ ok: true });

    await PasswordResetToken.deleteMany({
      userId: user._id,
      used: false,
    });

    const raw = crypto.randomBytes(48).toString("hex");
    const hash = crypto.createHash("sha256").update(raw).digest("hex");

    await PasswordResetToken.create({
      userId: user._id,
      hash,
      expiresAt: Date.now() + 15 * 60 * 1000,
    });

    const link = `${FRONTEND}/reset-password/${raw}`;

    // Elegant Forgot-Password Email
    const forgotEmailHtml = `
<table cellpadding="0" cellspacing="0" border="0" width="100%" style="font-family:Arial,sans-serif;max-width:600px;margin:20px auto;border:1px solid #ddd;border-radius:8px;overflow:hidden;">
  <tr>
    <td style="background:#ffa733;padding:20px;text-align:center;">
      <h1 style="color:#fff;margin:0;font-size:24px;">Reset Your Password</h1>
    </td>
  </tr>
  <tr>
    <td style="padding:20px;background:#fafafa;">
      <p style="margin:0 0 12px;color:#333;font-size:16px;">
        Hi ${user.name?.split(" ")[0] || "there"},
      </p>
      <p style="margin:0 0 12px;color:#555;font-size:14px;">
        We received a request to reset your password. Click the button below to choose a new password. This link will expire in 15 minutes.
      </p>
      <p style="text-align:center;margin:20px 0;">
        <a href="${link}" style="background:#ffa733;color:#fff;padding:12px 24px;text-decoration:none;border-radius:4px;font-weight:bold;">
          Reset Password
        </a>
      </p>
      <p style="margin:0 0 12px;color:#999;font-size:12px;">
        If you did not request a password reset, please ignore this email.
      </p>
    </td>
  </tr>
  <tr>
    <td style="background:#fff;padding:12px;text-align:center;font-size:12px;color:#888;border-top:1px solid #ddd;">
      © 2025 Dresses Fashion Store. All rights reserved.
    </td>
  </tr>
</table>
`;

    await mailer.sendMail({
      from: '"Dresses Fashion Store" <dressesfashionstore@gmail.com>',
      to: user.email,
      subject: "Reset Your Password",
      html: forgotEmailHtml,
    });

    return res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

router.post("/reset/:token", async (req, res, next) => {
  try {
    const raw = req.params.token;
    const actualPassword = req.body.newPassword ?? req.body.password;

    if (!actualPassword || actualPassword.length < 6) {
      return next(createError(400, "Password must be at least 6 characters"));
    }

    const hash = crypto.createHash("sha256").update(raw).digest("hex");
    const record = await PasswordResetToken.findOne({ hash });

    if (
      !record ||
      record.used ||
      (record.expiresAt instanceof Date
        ? record.expiresAt.getTime() < Date.now()
        : record.expiresAt < Date.now())
    ) {
      return next(createError(400, "Reset link is invalid or has expired"));
    }

    const user = await User.findById(record.userId);
    if (!user) return next(createError(404, "User not found"));

    user.password = bcrypt.hashSync(actualPassword, 10);
    await user.save();

    record.used = true;
    await record.save();

    // Elegant Password-Changed Confirmation Email
    const confirmEmailHtml = `
<table cellpadding="0" cellspacing="0" border="0" width="100%" style="font-family:Arial,sans-serif;max-width:600px;margin:20px auto;border:1px solid #ddd;border-radius:8px;overflow:hidden;">
  <tr>
    <td style="background:#4caf50;padding:20px;text-align:center;">
      <h1 style="color:#fff;margin:0;font-size:24px;">Password Changed</h1>
    </td>
  </tr>
  <tr>
    <td style="padding:20px;background:#fafafa;">
      <p style="margin:0 0 12px;color:#333;font-size:16px;">
        Hi ${user.name?.split(" ")[0] || ""},
      </p>
      <p style="margin:0 0 12px;color:#555;font-size:14px;">
        Your password has been changed successfully. If you did not perform this action, please contact our support immediately.
      </p>
      <p style="margin:20px 0;text-align:center;">
        <a href="${FRONTEND}/signin" style="background:#4caf50;color:#fff;padding:12px 24px;text-decoration:none;border-radius:4px;font-weight:bold;">
          Sign In
        </a>
      </p>
      <p style="margin:0 0 12px;color:#999;font-size:12px;">
        Thank you for keeping your account secure.
      </p>
    </td>
  </tr>
  <tr>
    <td style="background:#fff;padding:12px;text-align:center;font-size:12px;color:#888;border-top:1px solid #ddd;">
      © 2025 Dresses Fashion Store. All rights reserved.
    </td>
  </tr>
</table>
`;

    await mailer.sendMail({
      from: '"Dresses Fashion Store" <dressesfashionstore@gmail.com>',
      to: user.email,
      subject: "Your Password Was Changed",
      html: confirmEmailHtml,
    });

    return res.json({ message: "Password updated successfully" });
  } catch (err) {
    next(err);
  }
});

export default router;
