const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  filename: String,
  contentType: String,
  data: Buffer,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  location: {
    lat: Number,
    lng: Number,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("File", fileSchema);
