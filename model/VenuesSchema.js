const mongoose = require("mongoose");

const VenuesSchema = new mongoose.Schema(
  {
    VenuesName: { type: String, required: true },
    VenuesAddress: { type: String, required: true },
    VenueDescription: { type: String },
    VenueImage: { type: [String] },
    VenueSeats: { type: String },
  },
  { timestamps: true }
);

const Venues = mongoose.model("Venues", VenuesSchema);
module.exports = Venues;
