const mongoose = require("mongoose");

const TermsAndConditionsSchema = new mongoose.Schema(
  {
    termsAndConditionsHeading: { type: String, required: true },
    termsAndConditionsDescription: { type: String, required: true },
  },
  { timestamps: true }
);

const TermsAndConditions = mongoose.model(
  "TermsAndConditions",
  TermsAndConditionsSchema
);
module.exports = TermsAndConditions;
