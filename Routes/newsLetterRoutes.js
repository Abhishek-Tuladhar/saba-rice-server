const express = require("express");
const router = express.Router();
const {
  subscribeNewsletter,
  unsubscribeNewsletter,
} = require("../Controllers/newsletterController");
const formLimiter = require("../Middleware/rateLimiter");

router.post("/", subscribeNewsletter);
router.get("/unsubscribe", unsubscribeNewsletter);
router.post("/", formLimiter, subscribeNewsletter);

module.exports = router;
