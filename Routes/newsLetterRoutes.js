const express = require("express");
const router = express.Router();
const { subscribeNewsletter } = require("../Controllers/newsletterController");

router.post("/", subscribeNewsletter);

module.exports = router;