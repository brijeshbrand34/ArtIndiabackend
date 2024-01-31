const mongoose = require("mongoose");
const FooterSchema = new mongoose.Schema(
  {
    footerLogoImage: {
      type: [String],
    },
    footerTitle: {
      type: String,
    },
    footerDescription: {
      type: String,
    },
    footerEmail: {
      type: String,
    },
    footerAddress: {
      type: String,
    },
  },
  { timestamps: true }
);

const Footer = mongoose.model("Footer", FooterSchema);
module.exports = Footer;
