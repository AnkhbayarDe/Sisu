const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  filename: String,
  contentType: String,
  data: Buffer,
});

module.exports = mongoose.model("File", fileSchema);
