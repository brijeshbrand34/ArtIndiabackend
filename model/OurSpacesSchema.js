const mongoose = require("mongoose");
const OurSpacesSchema = new mongoose.Schema(
  {
    ourSpaceId: {
      type: String,
    },
    ourSpacesTitle: {
      type: String,
    },
    ourSpacesSubTitle: {
      type: String,
    },
    ourSpacesDescription: {
      type: String,
    },
    ourSpacesHighlights: {
      type: String,
    },
    ourSpacesImage: {
      type: [String],
    },
  },
  { timestamps: true }
);

const OurSpaces = mongoose.model("OurSpaces", OurSpacesSchema);
module.exports = OurSpaces;
