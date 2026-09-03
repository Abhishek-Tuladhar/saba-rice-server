const express = require("express");
const router = express.Router();
const { submitContactForm } = require("../Controllers/contactController");

const formLimiter = require("../Middleware/rateLimiter");
router.post("/", formLimiter, submitContactForm);

router.post("/", submitContactForm);

module.exports = router;
