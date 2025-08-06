import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  getCart,
  addToCart,
  updateCart,
} from "../controllers/cartController.js";

const router = express.Router();

router.use(verifyToken);
router.get("/", getCart);
router.post("/", addToCart);
router.patch("/", updateCart);

export default router;
