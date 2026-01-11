require("dotenv").config({ path: "./.env" });
console.log("ENV CHECK 👉", process.env.MONGO_URI);
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
  User,
  CreditScore,
  CreditHistory,
  Bill,
  EMI,
  HiddenDebt
} = require("./models");

const app = express();

/* ============================================
   MIDDLEWARE
============================================ */

app.use(cors({ origin: "*"}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

/* ============================================
   DATABASE CONNECTION
============================================ */

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI missing in .env file");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas Connected"))
  .catch(err => {
    console.error("❌ MongoDB Error:", err.message);
    process.exit(1);
  });

/* ============================================
   AUTH MIDDLEWARE
============================================ */

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) return next(); // dev mode

  jwt.verify(
    token,
    process.env.JWT_SECRET || "dev_secret",
    (err, user) => {
      if (err) return res.status(403).json({ error: "Invalid token" });
      req.user = user;
      next();
    }
  );
};

/* ============================================
   ROUTES
============================================ */

app.get("/", (req, res) => {
  res.json({
    status: "CRED TRACKER API running 🚀",
    port: process.env.PORT || 3000
  });
});

/* -------- LOGIN -------- */

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      user: {
        name: user.name,
        email: user.email,
        isPremium: user.isPremium
      }
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Login failed" });
  }
});

/* -------- PROFILE -------- */

app.get("/api/user/profile", authenticateToken, async (req, res) => {
  const user = await User.findOne({ email: "yadavmohanhere@gmail.com" });
  if (!user) return res.status(404).json({ error: "User not found" });

  res.json({
    name: user.name,
    email: user.email,
    isPremium: user.isPremium
  });
});

/* ============================================
   SERVER START
============================================ */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 CRED TRACKER Backend running");
  console.log(`📡 http://localhost:${PORT}`);
});
