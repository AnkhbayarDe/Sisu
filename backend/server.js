const express = require("express");
const mongoose = require("mongoose");
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

// Connect to separate MongoDB databases
const usersDB = mongoose.createConnection(process.env.MONGO_URI_USERS, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const filesDB = mongoose.createConnection(process.env.MONGO_URI_FILES, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
});

const FileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  contentType: {
    type: String,
    required: true,
  },
  data: {
    type: Buffer,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  location: {
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

FileSchema.index({ userId: 1 });
FileSchema.index({ "location.lat": 1, "location.lng": 1 });

const User = usersDB.model("User", UserSchema);
const File = filesDB.model("File", FileSchema);

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
async function createAdminIfNotExists() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin1234";

  try {
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log("Admin account already exists.");
      return;
    }

    const hashed = await bcrypt.hash(adminPassword, 10);
    const admin = new User({
      email: adminEmail,
      password: hashed,
      role: "admin",
    });
    await admin.save();
    console.log(`Admin account created: ${adminEmail}`);
  } catch (error) {
    console.error("Failed to create admin account:", error);
  }
}

// Signup
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  // Email format check (basic)
  const emailRegex = /^[^\s@]+@gmail\.com$/;
  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ message: "Имэйл @gmail.com бүтэцтэй байх ёстой." });
  }

  // Password requirements check
  const minLength = 8;
  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  if (password.length < minLength) {
    return res
      .status(400)
      .json({ message: "Нууц үг хамгийн багадаа 8 тэмдэгттэй байх ёстой." });
  }
  if (!hasLetter) {
    return res
      .status(400)
      .json({ message: "Нууц үгэнд дор хаяж нэг үсэг байх ёстой." });
  }
  if (!hasNumber) {
    return res
      .status(400)
      .json({ message: "Нууц үгэнд дор хаяж нэг тоо байх ёстой." });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashed, role: "user" });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 60 * 60 * 1000,
    });

    res.json({ message: "Logged in successfully", userId: user._id });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Check session
app.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ userId: req.userId, email: user.email, user: user.role });
  } catch (error) {
    console.error("Session check error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Logout
app.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
  });
  res.json({ message: "Logged out successfully" });
});
// Upload file with image/video validation
app.post("/upload", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    const { lat, lng } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const ACCEPTED_IMAGE_TYPES = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/bmp",
      "image/webp",
      "image/svg+xml",
      "image/tiff",
      "image/heic",
      "image/heif",
    ];

    const ACCEPTED_VIDEO_TYPES = [
      "video/mp4",
      "video/webm",
      "video/ogg",
      "video/quicktime",
      "video/x-msvideo",
      "video/x-matroska",
      "video/mpeg",
      "video/3gpp",
      "video/x-ms-wmv",
      "video/x-flv",
    ];

    const ACCEPTED_TYPES = [...ACCEPTED_IMAGE_TYPES, ...ACCEPTED_VIDEO_TYPES];

    // Validate file type server-side
    if (!ACCEPTED_TYPES.includes(req.file.mimetype)) {
      return res.status(400).json({
        message: "Invalid file type. Only images and videos are allowed.",
        error: "invalid_file_type",
      });
    }

    const file = new File({
      filename: req.file.originalname,
      contentType: req.file.mimetype,
      data: req.file.buffer,
      userId: req.userId,
      location: {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
      },
      uploadedAt: new Date(),
    });

    await file.save();
    res.status(201).json({
      message: "File uploaded successfully",
      fileId: file._id,
      filename: file.filename,
    });
  } catch (error) {
    console.error("File upload error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/files", authMiddleware, async (req, res) => {
  try {
    // You can add filters here if you want to get files for specific users
    const files = await File.find().select(
      "filename contentType userId location uploadedAt"
    );
    res.json(files);
  } catch (error) {
    console.error("Get files error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/files/locations", authMiddleware, async (req, res) => {
  const files = await File.find({ userId: req.userId }).select(
    "filename location uploadedAt"
  );
  res.json(files);
});

// Get files for current user
app.get("/myfiles", authMiddleware, async (req, res) => {
  try {
    const files = await File.find({ userId: req.userId }).select(
      "filename contentType location uploadedAt"
    );

    if (files.length === 0) {
      return res.status(404).json({ message: "No files found" });
    }

    res.status(200).json(files);
  } catch (error) {
    console.error("Error fetching user files:", error);
    res.status(500).json({ message: "Server error" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await createAdminIfNotExists();
});


app.get("/myfiles/:id", async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (file && file.data) {
      // Make sure we're sending valid base64 data
      // Buffer.from() will handle the case even if file.data is already a Buffer
      const buffer = Buffer.from(file.data);
      const base64Image = buffer.toString('base64');
      
      res.json({
        image: base64Image,
        contentType: file.contentType,
        filename: file.filename
      });
    } else {
      res.status(404).json({ message: "File not found" });
    }
  } catch (err) {
    console.error("Error getting file:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});