const mongoose = require("mongoose");

const FAQSchema = mongoose.Schema(
  {
    faqID: { type: String },
    question: { type: String },
    answer: {type: String},
  },
  { timestamps: true }
);

const faq = mongoose.model("faq", FAQSchema);

module.exports = faq;
