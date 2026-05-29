import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";

import { connectDB } from "./lib/db.js";

const app = express();
const PORT = process.env.PORT || 5001;

const __dirname = path.resolve();

app.use(
  cors({
    origin: process.env.NODE_ENV === "production"
      ? process.env.FRONTEND_URL
      : "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});

// Keep-alive ping every 14 minutes to prevent Render free tier sleep
const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${PORT}`;

setInterval(async () => {
  try {
    await fetch(`${BACKEND_URL}/api/health`);
    console.log("Keep-alive ping sent");
  } catch (error) {
    console.log("Keep-alive ping failed:", error.message);
  }
}, 14 * 60 * 1000); // 14 minutes

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});