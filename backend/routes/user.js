// backend/routes/user.js
import express from "express";
import { UserLogin, UserRegister } from "../controllers/user.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// auth
router.post("/signup", UserRegister);
router.post("/signin", UserLogin);

// get all saved addresses
router.get("/addresses", verifyToken, (req, res) => {
  res.json(req.user.addresses);
});
// add a new address
router.post("/addresses", verifyToken, async (req, res, next) => {
  try {
    const addr = req.body; // { fullName, phone, street, city, province, country, postalCode }
    req.user.addresses.push(addr);
    await req.user.save();
    res.json(req.user.addresses);
  } catch (err) {
    next(err);
  }
});

// get all saved payments
router.get("/payments", verifyToken, (req, res) => {
  res.json(req.user.paymentMethods);
});
// add a new payment
router.post("/payments", verifyToken, async (req, res, next) => {
  try {
    const pay = req.body; // { cardName, cardLast4, expiry }
    req.user.paymentMethods.push(pay);
    await req.user.save();
    res.json(req.user.paymentMethods);
  } catch (err) {
    next(err);
  }
});

router.get("/favourites", verifyToken, async (req, res, next) => {
  try {
    // populate the Product documents
    await req.user.populate("favourites");
    const list = req.user.favourites.map((prod) => ({
      productId: prod._id,
      name: prod.name,
      image: prod.image,
      price: prod.price,
      countInStock: prod.countInStock,
      onSale: prod.onSale,
      salePercent: prod.salePercent,
      colors: prod.colors,
    }));
    res.json(list);
  } catch (err) {
    next(err);
  }
});

// Add one to favourites
router.post("/favourites", verifyToken, async (req, res, next) => {
  try {
    const { productId } = req.body;
    // only add if not already present
    if (!req.user.favourites.includes(productId)) {
      req.user.favourites.push(productId);
      await req.user.save();
    }
    // respond with updated list
    await req.user.populate("favourites");
    const list = req.user.favourites.map((prod) => ({
      productId: prod._id,
      name: prod.name,
      image: prod.image,
      price: prod.price,
      countInStock: prod.countInStock,
      onSale: prod.onSale,
      salePercent: prod.salePercent,
      colors: prod.colors,
    }));
    res.json(list);
  } catch (err) {
    next(err);
  }
});

// Remove one from favourites
router.delete("/favourites", verifyToken, async (req, res, next) => {
  try {
    const { productId } = req.body;
    req.user.favourites = req.user.favourites.filter(
      (id) => id.toString() !== productId
    );
    await req.user.save();
    // respond with updated list
    await req.user.populate("favourites");
    const list = req.user.favourites.map((prod) => ({
      productId: prod._id,
      name: prod.name,
      image: prod.image,
      price: prod.price,
      countInStock: prod.countInStock,
      onSale: prod.onSale,
      salePercent: prod.salePercent,
      colors: prod.colors,
    }));
    res.json(list);
  } catch (err) {
    next(err);
  }
});

export default router;
