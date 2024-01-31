require("../db/conn");
const express = require("express");
const router = express.Router();
const TermsAndConditions = require("../model/TermsAndConditionsSchema");

router.post("/termsAndConditionsAdd", async (req, res) => {
  try {
    const { termsAndConditionsHeading, termsAndConditionsDescription } =
      req.body;
    // Validate input

    if (!termsAndConditionsHeading || !termsAndConditionsDescription) {
      return res.status(400).json({
        error:
          "Both termsAndConditionsHeading and termsAndConditionsDescription are required.",
      });
    }
    // Create a new Venue instance
    const newTermsAndConditions = new TermsAndConditions({
      termsAndConditionsHeading: termsAndConditionsHeading,
      termsAndConditionsDescription: termsAndConditionsDescription,
    });
    // Save the new venue to the database
    const savedTermsAndConditions = await newTermsAndConditions.save();
    res.status(201).json({
      message: "Terms And Conditions added successfully",
      data: savedTermsAndConditions,
    }); // Return the saved venue in the response
  } catch (error) {
    console.error("Error adding Terms And Conditions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/getAllTermsAndConditions", async (req, res) => {
  try {
    const termsAndConditions = await TermsAndConditions.find({});
    console.log(
      "This is the terms and conditions information:",
      termsAndConditions
    );
    res.json(termsAndConditions);
  } catch (error) {
    console.error("Error fetching terms and conditions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/getOneTermsAndConditions/:id", async (req, res) => {
  const TermsAndConditionsID = req.params.id;
  console.log("getOne", TermsAndConditionsID);
  console.log("get", req.params.id);
  try {
    const termsAndConditions = await TermsAndConditions.findOne({
      _id: TermsAndConditionsID,
    });

    if (!termsAndConditions) {
      return res.status(404).json({ error: "terms and conditions not found" });
    }

    console.log(
      "terms and conditions information for ID",
      TermsAndConditionsID,
      ":",
      termsAndConditions
    );

    res.json({ termsAndConditions });
  } catch (error) {
    console.error("Error fetching terms and conditions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/updateTermsAndConditions/:Id", async (req, res) => {
  const { TermsAndConditionsHeading, TermsAndConditionsDescription } = req.body;
  console.log(req.body);
  const termsAndConditionsID = req.params.Id;
  console.log(termsAndConditionsID);

  try {
    const result = await TermsAndConditions.findByIdAndUpdate(
      termsAndConditionsID,
      {
        termsAndConditionsHeading: TermsAndConditionsHeading,
        termsAndConditionsDescription: TermsAndConditionsDescription,
      }
    );

    if (result.n === 0) {
      return res
        .status(404)
        .json({ error: "terms and conditions not updated" });
    }

    res
      .status(200)
      .json({ message: "terms and conditions updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
