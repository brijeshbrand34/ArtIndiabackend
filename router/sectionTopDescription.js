const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const path = require("path");

const multer = require("multer");
require("../db/conn");

const SectionTopDescription = require("../model/SectionTopDescriptionSchema");

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

router.post("/addSectionTop", upload.array("sectionTopImage"), (req, res) => {
  const { sectionTopDescriptionText } = req.body;
  const fileNames = req.files?.map((file) => file.filename);

  const newData = new SectionTopDescription({
    sectionTopDescriptionText: sectionTopDescriptionText,
    sectionTopImage: fileNames,
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

router.get("/getSectionTop", async (req, res) => {
  try {
    const SectionTop = await SectionTopDescription.find({}); // Fetch all Blogs from the database

    console.log("This is the Section Top information:", SectionTop);

    res.json(SectionTop); // Send the Blogs as JSON response
  } catch (error) {
    console.error("Error fetching Section Top data:", error);
    res.status(500).json({ error: "Internal Server Error in Section Top" });
  }
});

router.put(
  "/updateSectionTop/:id",
  upload.array("sectionTopImage"),
  async (req, res) => {
    const { sectionTopDescriptionText } = req.body;
    const sectionTopDescriptionId = req.params._id;

    try {
      if (!req.files || !req.files.length) {
        return res.status(400).json({ error: "No files uploaded." });
      }

      const fileNames = req.files.map((file) => file.filename);

      const result = await SectionTopDescription.updateOne(
        { sectionTopDescriptionId: sectionTopDescriptionId },
        {
          $set: {
            sectionTopDescriptionText: sectionTopDescriptionText,
            sectionTopImage: fileNames, // Use fileNames here instead of blogImage
          },
        }
      );

      if (result.n === 0) {
        return res.status(404).json({ error: "Section Top  not found" });
      }

      res.status(200).json({ message: "Section Top updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

module.exports = router;
