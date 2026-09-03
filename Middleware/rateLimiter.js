const rateLimit = require("express-rate-limit");

const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 5,
  message: { error: "Too many requests. Please try again later." },
});

module.exports = formLimiter;