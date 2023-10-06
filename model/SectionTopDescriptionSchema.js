const mongoose = require("mongoose");

const SectionTopDescriptionSchema = new mongoose.Schema(
  {
    sectionTopImage: {
      type: [String],
    },
    sectionTopDescriptionText: {
      type: String,
    },
  },
  { timestamps: true }
);

const SectionTopDescription = mongoose.model(
  "SectionTopDescription",
  SectionTopDescriptionSchema
);
module.exports = SectionTopDescription;
