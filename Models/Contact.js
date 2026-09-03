const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    enquiryType: {
      type: String,
      trim: true,
      enum: ["general", "order", "wholesale", "distribution", "other"],
    },
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 500,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Contact", contactSchema);
