const express = require("express");
const router = express.Router();
const {
  subscribeNewsletter,
  unsubscribeNewsletter,
} = require("../Controllers/newsletterController");
const formLimiter = require("../Middleware/rateLimiter");

// POST /api/newsletter - Subscribe with rate limiting
router.post("/", formLimiter, subscribeNewsletter);

// GET /api/newsletter/unsubscribe - Unsubscribe
router.get("/unsubscribe", unsubscribeNewsletter);

// OPTIONS handler for CORS preflight
router.options("/", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "https://sabarice.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.status(200).end();
});

module.exports = router;