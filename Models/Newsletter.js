const mongoose = require("mongoose");
const crypto = require("crypto");

const newsletterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    unsubscribeToken: {
      type: String,
      default: () => crypto.randomBytes(24).toString("hex"),
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Newsletter", newsletterSchema);