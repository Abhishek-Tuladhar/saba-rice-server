const express = require("express");

const router = express.Router();

const { submitContactForm } = require("../Controllers/contactController");
const formLimiter = require("../Middleware/rateLimiter");

router.post("/", formLimiter, submitContactForm);

module.exports = router;
