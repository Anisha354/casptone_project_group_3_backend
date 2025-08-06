// controllers/user.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { createError } from "../error.js";
import User from "../models/user.js";

dotenv.config();

export const UserRegister = async (req, res, next) => {
  try {
    const { email, password, name, img } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) return next(createError(409, "Email is already in use"));

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      img,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT, {
      expiresIn: "9999 years",
    });

    res.status(201).json({ token, user: newUser });
  } catch (err) {
    next(err);
  }
};

export const UserLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return next(createError(404, "User not found"));

    const ok = bcrypt.compareSync(password, user.password);
    if (!ok) return next(createError(403, "Incorrect password"));

    const token = jwt.sign({ id: user._id }, process.env.JWT, {
      expiresIn: "9999 years",
    });

    res.status(200).json({ token, user });
  } catch (err) {
    next(err);
  }
};
