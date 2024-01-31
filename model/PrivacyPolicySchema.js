const mongoose = require("mongoose");

const PrivacyPolicySchema = new mongoose.Schema(
  {
    privacyPolicyHeading: { type: String, required: true },
    privacyPolicyDescription: { type: String, required: true },
  },
  { timestamps: true }
);

const PrivacyPolicy = mongoose.model("PrivacyPolicy", PrivacyPolicySchema);
module.exports = PrivacyPolicy;
