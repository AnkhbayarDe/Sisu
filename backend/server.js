const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");
const File = require("./models/File");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const upload = multer();

// Connect users DB
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
  res.json({ token });
});

// Upload file
app.post("/upload", upload.single("file"), async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    const file = new FileModel({
      filename: req.file.originalname,
      contentType: req.file.mimetype,
      data: req.file.buffer,
    });
    await file.save();
    res.json({ message: "File uploaded" });
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
});

app.listen(process.env.PORT, () =>
  console.log("Server running on port " + process.env.PORT)
);
