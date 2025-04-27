const express = require("express");
const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/authRoutes");
const contactRoutes = require("./routes/contact");
const subscribeRoutes = require("./routes/subscribe");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

// Load environment variables
const {
  MONGO_URI,
  HTTP_PORT,
  HTTPS_PORT,
  SSL_KEY_PATH,
  SSL_CERT_PATH,
  ALLOWED_ORIGINS
} = process.env;

// CORS setup
const allowedOrigins = ALLOWED_ORIGINS ? ALLOWED_ORIGINS.split(",") : [];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Routes
app.use("/api", bookingRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/subscribe", subscribeRoutes);
app.use("/api/payment", paymentRoutes);

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

    // HTTP Server
    http.createServer(app).listen(HTTP_PORT, () => {
      console.log(`🌍 HTTP Server running on http://localhost:${HTTP_PORT}`);
    });

    // HTTPS Server
    const sslServer = https.createServer(
      {
        key: fs.readFileSync(path.resolve(SSL_KEY_PATH)),
        cert: fs.readFileSync(path.resolve(SSL_CERT_PATH)),
      },
      app
    );

    sslServer.listen(HTTPS_PORT, () =>
      console.log(`🔒 HTTPS Server running on https://localhost:${HTTPS_PORT}`)
    );

  })
  .catch(err => console.error(err));
