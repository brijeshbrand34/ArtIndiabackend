require("../db/conn");
const express = require("express");
const router = express.Router();
const PrivacyPolicy = require("../model/PrivacyPolicySchema");

router.post("/privacyPolicyAdd", async (req, res) => {
  try {
    const { privacyPolicyHeading, privacyPolicyDescription } = req.body;
    // Validate input

    if (!privacyPolicyHeading || !privacyPolicyDescription) {
      return res.status(400).json({
        error:
          "Both privacyPolicyHeading and privacyPolicyDescription are required.",
      });
    }
    // Create a new Venue instance
    const newPrivacyPolicy = new PrivacyPolicy({
      privacyPolicyHeading: privacyPolicyHeading,
      privacyPolicyDescription: privacyPolicyDescription,
    });
    // Save the new venue to the database
    const savedPrivacyPolicy = await newPrivacyPolicy.save();
    res.status(201).json({
      message: "Privacy Policy added successfully",
      data: savedPrivacyPolicy,
    }); // Return the saved venue in the response
  } catch (error) {
    console.error("Error adding Privacy Policy:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/getAllPrivacyPolicy", async (req, res) => {
  try {
    const privacyPolicy = await PrivacyPolicy.find({});
    console.log("This is the Privacy Policy information:", privacyPolicy);
    res.json(privacyPolicy);
  } catch (error) {
    console.error("Error fetching privacy policy:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/getOnePrivacyPolicy/:id", async (req, res) => {
  const PrivacyPolicyID = req.params.id;
  console.log("getOne", PrivacyPolicyID);
  console.log("get", req.params.id);
  try {
    const privacyPolicy = await PrivacyPolicy.findOne({
      _id: PrivacyPolicyID,
    });

    if (!privacyPolicy) {
      return res.status(404).json({ error: "privacy policy not found" });
    }

    console.log(
      "privacy policy information for ID",
      PrivacyPolicyID,
      ":",
      privacyPolicy
    );

    res.json({ privacyPolicy });
  } catch (error) {
    console.error("Error fetching privacy policy:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/updatePrivacyPolicy/:Id", async (req, res) => {
  const { PrivacyPolicyHeading, PrivacyPolicyDescription } = req.body;
  console.log(req.body);
  const privacyPolicyID = req.params.Id;

  try {
    const result = await PrivacyPolicy.findByIdAndUpdate(
      privacyPolicyID,

      {
        privacyPolicyHeading: PrivacyPolicyHeading,
        privacyPolicyDescription: PrivacyPolicyDescription,
      }
    );

    if (result.n === 0) {
      return res.status(404).json({ error: "privacy policy not found" });
    }

    res.status(200).json({ message: "privacy policy updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
