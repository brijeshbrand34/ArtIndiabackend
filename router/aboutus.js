const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const path = require("path");

const multer = require("multer");
require("../db/conn");
const Aboutus = require("../model/AboutusSchema");

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

router.get("/getAboutus", async (req, res) => {
  try {
    const Page = await Aboutus.find({});
    console.log("This is the Aboutus information:", Page);
    res.json(Page);
  } catch (error) {
    console.error("Error fetching Aboutus:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put(
  "/Aboutusupdate/:Id",
  upload.fields([
    { name: "bgimg", maxCount: 1 },
    { name: "firstimg", maxCount: 1 },
    { name: "secondimg", maxCount: 1 },
    { name: "ceoimg", maxCount: 1 },
  ]),
  async (req, res) => {
    let {
      BGTitle,
      // BGSubTitle,
      // BGDescription,
      FirstTitle,
      FirstSubTitle,
      FirstDescription,
      SecondTitle,
      SecondSubTitle,
      SecondDescription,
      CeoDeatils,
      // ShortDescription,
      Description,
    } = req.body;

    console.log("Request Body:", req.body);
    const aboutID = req.params.Id;

    try {
      const About = await Aboutus.findOne({ _id: aboutID });
      console.log("Found Aboutus:", About);
      if (!About) {
        return res.status(404).json({ error: "About page not found" });
      }

      const result = await Aboutus.updateOne(
        { _id: aboutID },
        {
          $set: {
            BGTitle: BGTitle,
            // BGSubTitle: BGSubTitle,
            // BGDescription: BGDescription,
            BGImage: req.files["bgimg"][0].filename,

            FirstTitle: FirstTitle,
            FirstSubTitle: FirstSubTitle,
            FirstDescription: FirstDescription,
            FirstImage: req.files["firstimg"][0].filename,

            SecondTitle: SecondTitle,
            SecondSubTitle: SecondSubTitle,
            SecondDescription: SecondDescription,
            SecondImage: req.files["secondimg"][0].filename,

            CeoDeatils: CeoDeatils,
            // ShortDescription: ShortDescription,
            Description: Description,
            CeoImage: req.files["ceoimg"][0].filename,
          },
        }
      );
      console.log("Update Result:", result);

      if (result.nModified === 0) {
        return res.status(404).json({ error: "Pages not updated" });
      }

      res.status(200).json({ message: "Pages updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);
module.exports = router;
