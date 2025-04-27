const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  email: String,
  selectedDate: String,
  selectedSize: String,
  imageUrl: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Booking", bookingSchema);
