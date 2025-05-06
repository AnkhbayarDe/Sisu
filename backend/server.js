const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");
const File = require("./models/File");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
const upload = multer();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

const usersDB = mongoose.createConnection(process.env.MONGO_URI_USERS);
const filesDB = mongoose.createConnection(process.env.MONGO_URI_FILES);

const FileModel = filesDB.model(
  "File",
  new mongoose.Schema({
    filename: String,
    contentType: String,
    data: Buffer,
  })
);

const UserModel = usersDB.model(
  "User",
  new mongoose.Schema({
    email: String,
    password: String,
  })
);

// Middleware to check auth from cookie
function authMiddleware(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}

// Signup
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = new UserModel({ email, password: hashed });
  await user.save();
  res.send({ message: "User registered" });
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.json({ message: "Logged in" });
});

// Check session
app.get("/me", authMiddleware, (req, res) => {
  res.json({ userId: req.userId });
});

// Logout
app.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

// Upload file
app.post("/upload", authMiddleware, upload.single("file"), async (req, res) => {
  const file = new FileModel({
    filename: req.file.originalname,
    contentType: req.file.mimetype,
    data: req.file.buffer,
  });
  await file.save();
  res.json({ message: "File uploaded" });
});

app.listen(process.env.PORT, () =>
  console.log("Server running on port " + process.env.PORT)
);
