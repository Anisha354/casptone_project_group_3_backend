// backend/index.js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import userRoutes from "./routes/user.js";
import contactRoutes from "./routes/contactRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import CartRouter from "./routes/cartRoutes.js";
import OrderRouter from "./routes/orders.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
app.set("trust proxy", 1);

// ── CORS setup ───────────────────────────────────────
const FRONTEND =
  process.env.FRONTEND_ORIGIN ||
  "https://casptone-project-group-3-frontend.onrender.com";

const allowedOrigins = [FRONTEND];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (mobile apps, curl, etc)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ensure preflight requests also get CORS headers
app.options(
  "*",
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ── Body parsers ──────────────────────────────────────
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

// ── Static images ─────────────────────────────────────
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use("/images", express.static(path.join(__dirname, "seed/images")));

// ── API Routes ────────────────────────────────────────
app.get("/", (_req, res) => {
  res.status(200).json({ message: "Hello This is Group 3 Project" });
});
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", CartRouter);
app.use("/api/orders", OrderRouter);
app.use("/api/contact", contactRoutes);

// ── Serve React build for all other routes ───────────
const buildPath = path.join(__dirname, "../frontend/build");
app.use(express.static(buildPath));
app.get("/*", (_req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

// ── Error handler ─────────────────────────────────────
app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  const message = err.message || "Server error";
  console.error(`[${status}] ${message}`);
  res.status(status).json({ success: false, status, message });
});

// ── Database & Server ─────────────────────────────────
const connectDB = () => {
  mongoose.set("strictQuery", true);
  const mongoUri = process.env.MODNO_DB || process.env.MONGO_URI;
  mongoose
    .connect(mongoUri)
    .then(() => console.log("Connected to Capstone Group 3 MongoDB"))
    .catch((err) => {
      console.error("Failed to connect with MongoDB", err);
    });
};

connectDB();

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server started on port ${port}`));
