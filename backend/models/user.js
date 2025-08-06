// backend/models/user.js
import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  fullName: String,
  phone: String,
  street: String,
  city: String,
  province: String,
  country: String,
  postalCode: String,
});

const paymentSchema = new mongoose.Schema({
  cardName: String,
  cardLast4: String,
  expiry: String,
});

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cart: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: Number,
      },
    ],
    favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
    addresses: { type: [addressSchema], default: [] },
    paymentMethods: { type: [paymentSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
