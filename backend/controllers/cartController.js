import User from "../models/user.js";
import Product from "../models/Product.js";
import { createError } from "../error.js";

export const getCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("cart.product") // bring full product data
      .lean();
    res.json(user.cart || []);
  } catch (err) {
    next(err);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const { productId, qty = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) return next(createError(404, "Product not found"));

    const user = await User.findById(req.user.id);

    const line = user.cart.find((l) => l.product.equals(productId));
    const newQty = Math.min(
      product.countInStock,
      (line ? line.quantity : 0) + Number(qty)
    );

    if (line) line.quantity = newQty;
    else user.cart.push({ product: productId, quantity: newQty });

    await user.save();
    res.json(user.cart);
  } catch (err) {
    next(err);
  }
};

export const updateCart = async (req, res, next) => {
  try {
    const { productId, qty } = req.body;
    const user = await User.findById(req.user.id);

    user.cart = user.cart.filter((l) => !l.product.equals(productId));
    if (qty > 0) user.cart.push({ product: productId, quantity: qty });

    await user.save();
    res.json(user.cart);
  } catch (err) {
    next(err);
  }
};
