const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema(
  {
    contactId: {
      type: String,
    },
    contactName: {
      type: String,
    },
    contactEmail: {
      type: String,
    },
    contactPhoneNumber: {
      type: String,
    },
    contactMessage: {
      type: String,
    },
  },
  { timestamps: true }
);

const Contact = mongoose.model("Contact", ContactSchema);
module.exports = Contact;
