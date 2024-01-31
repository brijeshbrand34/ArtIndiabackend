const mongoose = require("mongoose");

const EventseatsSchema = new mongoose.Schema({
  EventId: { type: String },
  eventDates: [
    {
      date: {
        type: Date,
        required: true,
      },
      times: [
        {
          time: {
            type: String,
            required: true,
          },
          numberOfSets: {
            type: Number,
            required: true,
          },
        },
      ],
    },
  ],
});
const Eventseats = mongoose.model("Eventseats", EventseatsSchema);
module.exports = Eventseats;
