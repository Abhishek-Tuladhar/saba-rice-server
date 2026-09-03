require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");
const connectDB = require("./Config/database");
const contactRoutes = require("./Routes/contactRoutes");
const notFound = require("./Middleware/notFound");
const errorHandler = require("./Middleware/errorHandler");
const newsletterRoutes = require("./Routes/newsLetterRoutes");
const sanitize = require("./Middleware/Sanitize");
const blogRoutes = require("./Routes/blogRoutes");

if (!process.env.MONGODB_URI) {
  console.error("Missing MONGODB_URI in environment");
  process.exit(1);
}

const app = express();
app.set("trust proxy", 1);

/* --------------------------------------------------
   Serve uploaded files
   -------------------------------------------------- */
app.use("/uploads", express.static("uploads"));

app.use(helmet());

const allowedOrigins = ["https://sabarice.vercel.app", "http://localhost:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(sanitize);

// Connect to MongoDB
connectDB();

app.get("/", (req, res) => {
  res.send("Hello from the server!");
});

app.get("/api/health", (req, res) => {
  const states = ["disconnected", "connected", "connecting", "disconnecting"];

  const dbState = mongoose.connection.readyState;

  res.status(dbState === 1 ? 200 : 503).json({
    status: dbState === 1 ? "ok" : "degraded",
    db: states[dbState] || "unknown",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/contact", contactRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/blogs", blogRoutes);

// Not found and error handlers must stay last
app.use(notFound);
app.use(errorHandler);

// Only listen if running locally (not on Vercel)
if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}

// Export for Vercel serverless
module.exports = app;
