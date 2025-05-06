const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  contentType: {
    type: String,
    required: true
  },
  data: {
    type: Buffer,
    required: true
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true
  },
  location: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

// Add indexes for faster queries
fileSchema.index({ userId: 1 });
fileSchema.index({ "location.lat": 1, "location.lng": 1 });

module.exports = mongoose.model("File", fileSchema);