const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const path = require("path");

const multer = require("multer");
require("../db/conn");

const HeroSection = require("../model/HeroSectionSchema");

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

router.post(
  "/addHeroSectionBanner",
  upload.array("heroSectionBannerVideo"),
  (req, res) => {
    const {
      heroSectionBannnerTitle,
      heroSectionBannerSubTitle,
      heroSectionBannerLink,
    } = req.body;
    const fileNames = req.files?.map((file) => file.filename);

    const newData = new HeroSection({
      heroSectionBannerId: "banner" + generateUniqueId(),
      heroSectionBannnerTitle: heroSectionBannnerTitle,
      heroSectionBannerSubTitle: heroSectionBannerSubTitle,
      heroSectionBannerLink: heroSectionBannerLink,
      heroSectionBannerVideo: fileNames,
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

router.get("/getHeroSectionBanners", async (req, res) => {
  try {
    const heroSection = await HeroSection.find({}); // Fetch all Blogs from the database

    console.log("This is the hero Section information:", heroSection);

    res.json(heroSection); // Send the Blogs as JSON response
  } catch (error) {
    console.error("Error fetching hero Section data:", error);
    res.status(500).json({ error: "Internal Server Error in hero Section" });
  }
});

router.get("/getOneHeroSectionBanners/:id", async (req, res) => {
  const HeroSectionBannerId = req.params.id;

  try {
    const banner = await HeroSection.findById(HeroSectionBannerId);

    if (!banner) {
      return res.status(404).json({ error: "Hero Section not found" });
    }

    console.log(
      "HeroSection information for ID",
      HeroSectionBannerId,
      ":",
      banner
    );

    res.json({ banner });
  } catch (error) {
    console.error("Error fetching Hero Section:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put(
  "/updateHeroSectionBanner/:id",
  upload.array("heroSectionBannerVideo"),
  async (req, res) => {
    const {
      heroSectionBannnerTitle,
      heroSectionBannerSubTitle,
      heroSectionBannerLink,
    } = req.body;
    const HeroSectionBannerId = req.params.id;
    // console.log(BlogId);

    try {
      if (!req.files || !req.files.length) {
        return res.status(400).json({ error: "No files uploaded." });
      }

      const fileNames = req.files.map((file) => file.filename);

      const result = await HeroSection.findByIdAndUpdate(
        HeroSectionBannerId,

        {
          heroSectionBannnerTitle: heroSectionBannnerTitle,
          heroSectionBannerSubTitle: heroSectionBannerSubTitle,
          heroSectionBannerLink: heroSectionBannerLink,
          heroSectionBannerVideo: fileNames,
        }
      );

      if (result.n === 0) {
        return res.status(404).json({ error: "Hero Section not found" });
      }

      res.status(200).json({ message: "Hero Section updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.delete("/deleteHeroSectionBanner/:id", (req, res) => {
  HeroSection.findByIdAndDelete(req.params.id)
    .then((banner) => {
      if (!banner) {
        return res.status(404).send("Not Found");
      }
      res.send("Deleted Successfully");
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

module.exports = router;
