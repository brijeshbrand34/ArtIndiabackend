const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const path = require("path");

const multer = require("multer");
require("../db/conn");

const OurSpaces = require("../model/OurSpacesSchema");

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

const storage = multer.diskStorage({
  destination: "./assets/uploads/",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

router.post("/addOurSpaces", upload.array("ourSpacesImage"), (req, res) => {
  const {
    ourSpacesTitle,
    ourSpacesSubTitle,
    ourSpacesDescription,
    ourSpacesHighlights,
  } = req.body;
  const fileNames = req.files?.map((file) => file.filename);

  const newData = new OurSpaces({
    ourSpaceId: "space" + generateUniqueId(),
    ourSpacesTitle: ourSpacesTitle,
    ourSpacesSubTitle: ourSpacesSubTitle,
    ourSpacesDescription: ourSpacesDescription,
    ourSpacesHighlights: ourSpacesHighlights,
    ourSpacesImage: fileNames,
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

router.get("/getOurSpaces", async (req, res) => {
  try {
    const ourSpaces = await OurSpaces.find({}); // Fetch all Blogs from the database

    console.log("This is Our Spaces information:", ourSpaces);

    res.json(ourSpaces); // Send the Blogs as JSON response
  } catch (error) {
    console.error("Error fetching Our Spaces data:", error);
    res.status(500).json({ error: "Internal Server Error in Our Spaces" });
  }
});

router.get("/getOneHeroSectionBanners/:id", async (req, res) => {
  const ourSpacesId = req.params.id;

  try {
    const space = await OurSpaces.findById(ourSpacesId);

    if (!space) {
      return res.status(404).json({ error: "Our Spaces not found" });
    }

    console.log("Our Spaces information for ID", ourSpacesId, ":", space);

    res.json({ space });
  } catch (error) {
    console.error("Error fetching Our Spaces:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put(
  "/updateOurSpaces/:id",
  upload.array("ourSpacesImage"),
  async (req, res) => {
    const {
      ourSpacesTitle,
      ourSpacesSubTitle,
      ourSpacesDescription,
      ourSpacesHighlights,
    } = req.body;
    const ourSpacesId = req.params.id;

    try {
      if (!req.files || !req.files.length) {
        return res.status(400).json({ error: "No files uploaded." });
      }

      const fileNames = req.files.map((file) => file.filename);

      const result = await OurSpaces.findByIdAndUpdate(
        ourSpacesId,

        {
          ourSpacesTitle: ourSpacesTitle,
          ourSpacesSubTitle: ourSpacesSubTitle,
          ourSpacesDescription: ourSpacesDescription,
          ourSpacesHighlights: ourSpacesHighlights,
          ourSpacesImage: fileNames,
        }
      );

      if (result.n === 0) {
        return res.status(404).json({ error: "Our Spaces not found" });
      }

      res.status(200).json({ message: "Our Spaces updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.delete("/deleteOurSpace/:id", (req, res) => {
  OurSpaces.findByIdAndDelete(req.params.id)
    .then((space) => {
      if (!space) {
        return res.status(404).send("Not Found");
      }
      res.send("Deleted Successfully");
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

module.exports = router;
