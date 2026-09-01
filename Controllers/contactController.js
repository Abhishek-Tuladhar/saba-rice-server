const Contact = require("../Models/Contact");

const submitContactForm = async (req, res, next) => {
  try {
    const { name, email, phone, enquiryType, message } = req.body;

    if (!name || !email || !message) {
      res.status(400);
      throw new Error("Name, email, and message are required.");
    }

    const newContact = await Contact.create({
      name,
      email,
      phone,
      enquiryType,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Your form has been submitted successfully",
      data: newContact,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { submitContactForm };