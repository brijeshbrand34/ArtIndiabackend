const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const path = require("path");

const multer = require("multer");
require("../db/conn");

const WebsiteHeader = require("../model/WebsiteHeaderSchema");

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

router.post(
  "/addwebsiteHeader",
  upload.array("websiteHeaderLogoImage"),
  (req, res) => {
    const { whatsappIconLink, facebookIconLink, instagramIconLink } = req.body;
    const fileNames = req.files?.map((file) => file.filename);

    const newData = new WebsiteHeader({
      whatsappIconLink: whatsappIconLink,
      facebookIconLink: facebookIconLink,
      instagramIconLink: instagramIconLink,
      websiteHeaderLogoImage: fileNames,
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
  }
);

router.get("/getWebsiteHeader", async (req, res) => {
  try {
    const websiteHeader = await WebsiteHeader.find({}); // Fetch all Blogs from the database

    console.log("This is the website header information:", websiteHeader);

    res.json(websiteHeader); // Send the Blogs as JSON response
  } catch (error) {
    console.error("Error fetching website header data:", error);
    res.status(500).json({ error: "Internal Server Error in website header" });
  }
});

router.put(
  "/updateWebsiteHeader/:id",
  upload.array("websiteHeaderLogoImage"),
  async (req, res) => {
    const { whatsappIconLink, facebookIconLink, instagramIconLink } = req.body;
    const websiteHeaderId = req.params._id;

    try {
      if (!req.files || !req.files.length) {
        return res.status(400).json({ error: "No files uploaded." });
      }

      const fileNames = req.files.map((file) => file.filename);

      const result = await WebsiteHeader.updateOne(
        { websiteHeaderId: websiteHeaderId },
        {
          $set: {
            whatsappIconLink: whatsappIconLink,
            facebookIconLink: facebookIconLink,
            instagramIconLink: instagramIconLink,
            websiteHeaderLogoImage: fileNames, // Use fileNames here instead of blogImage
          },
        }
      );

      if (result.n === 0) {
        return res.status(404).json({ error: "Website Header not found" });
      }

      res.status(200).json({ message: "Website Header updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

module.exports = router;
