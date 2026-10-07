const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: String, // user or admin
  userId: String,
  text: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Message", messageSchema);