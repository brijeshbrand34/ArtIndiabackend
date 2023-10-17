
const mongoose = require("mongoose");
const SocialmediaSchema = new mongoose.Schema(
  {
    Link: {type: String}
  },
  { timestamps: true }
);

const Socialmedia = mongoose.model("Socialmedia", SocialmediaSchema);
module.exports = Socialmedia;