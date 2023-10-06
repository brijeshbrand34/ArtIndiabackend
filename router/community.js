const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const path = require("path");

const multer = require("multer");
require("../db/conn");

const Community = require("../model/CommunitySchema");

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

router.post("/addCommunity", upload.array("communityImage"), (req, res) => {
  const { communityTitle, communitySubTitle } = req.body;
  const fileNames = req.files?.map((file) => file.filename);

  const newData = new Community({
    communityId: "community" + generateUniqueId(),
    communityTitle: communityTitle,
    communitySubTitle: communitySubTitle,
    communityImage: fileNames,
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

router.get("/getCommunities", async (req, res) => {
  try {
    const community = await Community.find({});

    console.log("This is community information:", community);

    res.json(community);
  } catch (error) {
    console.error("Error fetching community data:", error);
    res.status(500).json({ error: "Internal Server Error in community" });
  }
});

router.get("/getOneCommunity/:id", async (req, res) => {
  const CommunityId = req.params.id;

  try {
    const community = await Community.findById(CommunityId);

    if (!community) {
      return res.status(404).json({ error: "Community not found" });
    }

    console.log("Community information for ID", CommunityId, ":", community);

    res.json({ community }); // Send the Product as JSON response
  } catch (error) {
    console.error("Error fetching Community:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put(
  "/updateCommunity/:id",
  upload.array("communityImage"),
  async (req, res) => {
    const { communityTitle, communitySubTitle } = req.body;
    const CommunityId = req.params.id;
    console.log(CommunityId);

    try {
      if (!req.files || !req.files.length) {
        return res.status(400).json({ error: "No files uploaded." });
      }

      const fileNames = req.files.map((file) => file.filename);

      const result = await Community.findByIdAndUpdate(
        CommunityId,

        {
          communityTitle: communityTitle,
          communitySubTitle: communitySubTitle,
          communityImage: fileNames,
        }
      );

      if (result.n === 0) {
        return res.status(404).json({ error: "community not found" });
      }

      res.status(200).json({ message: "community updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.delete("/deleteCommunity/:id", (req, res) => {
  comm = Community.findByIdAndDelete(req.params.id)
    .then((comm) => {
      if (!comm) {
        return res.status(404).send("Not Found");
      }
      res.send("Deleted Successfully");
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

module.exports = router;
