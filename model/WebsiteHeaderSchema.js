const mongoose = require("mongoose");
const WebsiteHeaderSchema = new mongoose.Schema(
  {
    websiteHeaderLogoImage: {
      type: [String],
    },
    // whatsappIconLink: {
    //   type: String,
    // },
    // facebookIconLink: {
    //   type: String,
    // },
    // instagramIconLink: {
    //   type: String,
    // },
  },
  { timestamps: true }
);

const WebsiteHeader = mongoose.model("WebsiteHeader", WebsiteHeaderSchema);
module.exports = WebsiteHeader;
