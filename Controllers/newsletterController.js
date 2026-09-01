const Newsletter = require("../Models/Newsletter");

const subscribeNewsletter = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400);
      throw new Error("Email is required.");
    }

    const existing = await Newsletter.findOne({ email });
    if (existing) {
      res.status(409);
      throw new Error("This email is already subscribed.");
    }

    const subscriber = await Newsletter.create({ email });

    res.status(201).json({
      success: true,
      message: "Subscribed successfully!",
      data: subscriber,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { subscribeNewsletter };