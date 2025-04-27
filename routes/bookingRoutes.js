const express = require("express");
const multer = require("multer");
const { handleBooking } = require("../controllers/bookingController");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/booking", upload.single("imageFile"), handleBooking);

module.exports = router;
