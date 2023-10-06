const mongoose = require("mongoose");
const HeroSectionSchema = new mongoose.Schema(
  {
    heroSectionBannerId: {
      type: String,
    },
    heroSectionBannnerTitle: {
      type: String,
    },
    heroSectionBannerSubTitle: {
      type: String,
    },
    heroSectionBannerLink: {
      type: String,
    },
    heroSectionBannerVideo: {
      type: [String],
    },
  },
  { timestamps: true }
);

const HeroSection = mongoose.model("HeroSection", HeroSectionSchema);
module.exports = HeroSection;
