// require("../db/conn");
const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const path = require("path");

const multer = require("multer");
require("../db/conn");
const Footer = require("../model/FooterSchema");

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

router.post("/addFooter", upload.array("footerLogoImage"), (req, res) => {
  const { footerTitle, footerDescription, footerEmail, footerAddress } =
    req.body;
  const fileNames = req.files?.map((file) => file.filename);

  const newData = new Footer({
    footerTitle: footerTitle,
    footerDescription: footerDescription,
    footerEmail: footerEmail,
    footerAddress: footerAddress,

    footerLogoImage: fileNames,
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

router.get("/getFooter", async (req, res) => {
  try {
    const footer = await Footer.find({}); // Fetch all Blogs from the database

    console.log("This is the footer information:", footer);

    res.json(footer);
  } catch (error) {
    console.error("Error fetching fotter data:", error);
    res.status(500).json({ error: "Internal Server Error in footer" });
  }
});

router.put(
  "/updateFooter/:id",
  upload.array("footerLogoImage"),
  async (req, res) => {
    const { footerTitle, footerDescription, footerEmail, footerAddress } =
      req.body;
    const footerId = req.params._id;

    try {
      if (!req.files || !req.files.length) {
        return res.status(400).json({ error: "No files uploaded." });
      }

      const fileNames = req.files.map((file) => file.filename);

      const result = await Footer.updateOne(
        { footerId: footerId },
        {
          $set: {
            footerTitle: footerTitle,
            footerDescription: footerDescription,
            footerEmail: footerEmail,
            footerAddress: footerAddress,

            footerLogoImage: fileNames,
          },
        }
      );

      if (result.n === 0) {
        return res.status(404).json({ error: "Footer not found" });
      }

      res.status(200).json({ message: "Footer updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

module.exports = router;
