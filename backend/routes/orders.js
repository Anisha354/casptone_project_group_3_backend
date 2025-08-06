// backend/routes/orders.js
import express from "express";
import Order from "../models/orders.js";
import User from "../models/user.js";
import mailer from "../utils/mailer.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Create a new order
router.post("/", verifyToken, async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { items, total, address, phone, payment } = req.body;

    // 1) Save order in DB
    const order = await Order.create({
      user: userId,
      items,
      total,
      address,
      phone,
      payment,
    });

    // 2) Fetch user for e-mail
    const user = await User.findById(userId);

    // 3) Build the HTML for the confirmation e-mail
    const itemRows = items
      .map(
        (it) => `
      <tr>
        <td style="padding:8px;border-bottom:1px solid #e0e0e0;color:#333;">${
          it.name
        }</td>
        <td style="padding:8px;text-align:center;border-bottom:1px solid #e0e0e0;color:#333;">${
          it.quantity
        }</td>
        <td style="padding:8px;text-align:right;border-bottom:1px solid #e0e0e0;color:#333;">$${it.price.toFixed(
          2
        )}</td>
      </tr>`
      )
      .join("");

    const emailHtml = `
<table cellpadding="0" cellspacing="0" border="0" width="100%" style="font-family:Arial,sans-serif;max-width:600px;margin:20px auto;border:1px solid #ddd;border-radius:8px;overflow:hidden;">
  <!-- Header -->
  <tr>
    <td style="background:#ffa733;padding:20px;text-align:center;">
      <h1 style="color:#ffffff;margin:0;font-size:24px;">
        Thank you for your order, ${user.name.split(" ")[0]}!
      </h1>
    </td>
  </tr>

  <!-- Order Info -->
  <tr>
    <td style="padding:20px;background:#f9f9f9;">
      <h2 style="margin:0 0 12px;color:#444;font-size:20px;border-bottom:2px solid #ffa733;display:inline-block;padding-bottom:4px;">
        Order Confirmation
      </h2>
      <p style="margin:8px 0;"><strong>Order ID:</strong> ${order._id}</p>
      <p style="margin:8px 0;"><strong>Total Paid:</strong> $${order.total.toFixed(
        2
      )}</p>

      <!-- Shipping Address -->
      <h3 style="margin-top:24px;margin-bottom:8px;color:#444;font-size:18px;">Shipping Address</h3>
      <p style="margin:4px 0;color:#555;">${address.street}</p>
      <p style="margin:4px 0;color:#555;">${address.city}, ${
      address.province
    } ${address.postalCode}, ${address.country}</p>
      <p style="margin:4px 0;color:#555;"><strong>Contact:</strong> ${phone}</p>

      <!-- Payment Method -->
      <h3 style="margin-top:24px;margin-bottom:8px;color:#444;font-size:18px;">Payment Method</h3>
      <p style="margin:4px 0;color:#555;">Card ending <strong>**** ${
        payment.cardLast4
      }</strong></p>
      <p style="margin:4px 0;color:#555;">Expiry: ${payment.expiry}</p>

      <!-- Items Table -->
      <h3 style="margin-top:24px;margin-bottom:8px;color:#444;font-size:18px;">Items Ordered</h3>
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;margin-bottom:16px;">
        <thead>
          <tr>
            <th style="text-align:left;padding:8px;border-bottom:2px solid #eee;color:#333;">Item</th>
            <th style="text-align:center;padding:8px;border-bottom:2px solid #eee;color:#333;">Qty</th>
            <th style="text-align:right;padding:8px;border-bottom:2px solid #eee;color:#333;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemRows}
        </tbody>
      </table>

      <p style="font-size:14px;color:#666;margin-top:24px;">
        We appreciate your business! If you have any questions, just reply to this email.
      </p>
    </td>
  </tr>

  <!-- Footer -->
  <tr>
    <td style="background:#ffffff;padding:12px;text-align:center;font-size:12px;color:#888;border-top:1px solid #ddd;">
      © 2025 Dresses Paradise. All rights reserved.
    </td>
  </tr>
</table>
`;

    // 4) Send confirmation email
    await mailer.sendMail({
      from: '"Dresses Paradise" <dressesfashionstore@gmail.com>',
      to: user.email,
      subject: "Your Order Confirmation",
      html: emailHtml,
    });

    // 5) **Clear out server-side cart** on the User document
    await User.findByIdAndUpdate(userId, { cart: [] });

    // 6) Return the new order to the frontend
    res.json({ order });
  } catch (err) {
    next(err);
  }
});

export default router;
