const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const path = require("path");

// const multer = require("multer");
require("../db/conn");

const ContactRoute = require("../model/ContactSchema");

function generateUniqueId() {
  const date = new Date();
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  const uniqueId = `${year}${month}${day}${hours}${minutes}${seconds}`;

  return uniqueId;
}

router.post("/addContact", (req, res) => {
  const { contactName, contactEmail, contactPhoneNumber, contactMessage } =
    req.body;

  const newData = new ContactRoute({
    contactId: "contact" + generateUniqueId(),
    contactName: contactName,
    contactEmail: contactEmail,
    contactPhoneNumber: contactPhoneNumber,
    contactMessage: contactMessage,
  });

  newData
    .save()
    .then((data) => {
      console.log("Data saved to MongoDB:", data);
      res
        .status(200)
        .json({ message: "Form data and files uploaded successfully." });
    })
    .catch((err) => {
      console.error("Error saving data to MongoDB:", err);
      res.status(500).json({ error: "Failed to save form data and files." });
    });
});

router.get("/getContacts", async (req, res) => {
  try {
    const contacts = await ContactRoute.find({});

    console.log("This is contact information:", contacts);

    res.json(contacts);
  } catch (error) {
    console.error("Error fetching contact data:", error);
    res.status(500).json({ error: "Internal Server Error in contact" });
  }
});

router.get("/getOneContacts/:id", async (req, res) => {
  const ContactId = req.params.id;

  try {
    const contact = await ContactRoute.findById(ContactId);

    if (!contact) {
      return res.status(404).json({ error: "contact not found" });
    }

    console.log("contact information for ID", ContactId, ":", contact);

    res.json({ contact }); // Send the Product as JSON response
  } catch (error) {
    console.error("Error fetching contact:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/updateContact/:id", async (req, res) => {
  const { contactName, contactEmail, contactPhoneNumber, contactMessage } =
    req.body;
  const ContactId = req.params.id;
  console.log(ContactId);

  try {
    const result = await ContactRoute.findByIdAndUpdate(
      ContactId,

      {
        contactName: contactName,
        contactEmail: contactEmail,
        contactPhoneNumber: contactPhoneNumber,
        contactMessage: contactMessage,
      }
    );

    if (result.n === 0) {
      return res.status(404).json({ error: "contact not found" });
    }

    res.status(200).json({ message: "contact updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/deleteContact/:id", (req, res) => {
  ContactRoute.findByIdAndDelete(req.params.id)
    .then((con) => {
      if (!con) {
        return res.status(404).send("Not Found");
      }
      // res.send("Deleted Successfully");
      res.status(200).json({ message: "contact updated successfully" });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

module.exports = router;
