const cloudinary = require("../config/cloudinary");
const transporter = require("../config/nodemailer");
const Booking = require("../models/Booking");
const streamifier = require("streamifier");

const handleBooking = async (req, res) => {
  try {
    const { selectedDate, selectedSize, email } = req.body;
    const fileBuffer = req.file.buffer;

    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) resolve(result);
          else reject(error);
        });
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    const result = await streamUpload(fileBuffer);

    const newBooking = new Booking({
      email,
      selectedDate,
      selectedSize,
      imageUrl: result.secure_url,
    });
    await newBooking.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_RECEIVER,
      subject: "New Booking - Construction Cleaning",
      html: `
        <h2>New Booking Confirmed</h2>
        <p><strong>Date:</strong> ${selectedDate}</p>
        <p><strong>Size:</strong> ${selectedSize}</p>
        <p><strong>Image URL:</strong> <a href="${result.secure_url}">View Image</a></p>
        <p><strong>Email from client:</strong> ${email}</p>
      `,
    });

    res.status(200).json({ message: "Booking confirmed and email sent!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { handleBooking };
