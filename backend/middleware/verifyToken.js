// backend/middleware/verifyToken.js
import jwt from "jsonwebtoken";
import { createError } from "../error.js";
import User from "../models/user.js";

export const verifyToken = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return next(createError(401, "You are not authenticated!"));
    const token = auth.split(" ")[1];
    if (!token) return next(createError(401, "You are not authenticated!"));
    const decoded = jwt.verify(token, process.env.JWT);
    // Fetch full user document
    const user = await User.findById(decoded.id);
    if (!user) return next(createError(401, "User not found"));
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
