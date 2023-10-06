const mongoose = require("mongoose");

const CommunitySchema = new mongoose.Schema(
  {
    communityId: {
      type: String,
    },
    communityTitle: {
      type: String,
    },
    communitySubTitle: {
      type: String,
    },
    communityImage: {
      type: [String],
    },
  },
  { timestamps: true }
);

const Community = mongoose.model("Communitie", CommunitySchema);
module.exports = Community;
