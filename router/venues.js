require("../db/conn");
const express = require("express");
const router = express.Router();
const Venues = require("../model/VenuesSchema");
const multer = require("multer");
const path = require("path");

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

// router.post("/Venuesadd", upload.array("VenueImage"), async (req, res) => {
//   try {
//     const { VenuesName, VenuesAddress, VenueDescription } = req.body;
//     // Validate input
//     const fileNames = req.files?.map((file) => file.filename);
//     if (!VenuesName || !VenuesAddress) {
//       return res
//         .status(400)
//         .json({ error: "Both venueName and venueAddress are required." });
//     }
//     // Create a new Venue instance
//     const newVenue = new Venues({
//       VenuesName: VenuesName,
//       VenuesAddress: VenuesAddress,
//       VenueImage: fileNames,
//       VenueDescription: VenueDescription,
//     });
//     // Save the new venue to the database
//     const savedVenue = await newVenue.save();
//     res
//       .status(201)
//       .json({ massege: "Add Venues add  successfully", data: savedVenue }); // Return the saved venue in the response
//   } catch (error) {
//     console.error("Error adding Venue:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

router.post("/Venuesadd", upload.array("VenueImage"), async (req, res) => {
  try {
    const { VenuesName, VenuesAddress, VenueDescription, VenueSeats } =
      req.body;
    // Validate input
    const fileNames = req.files?.map((file) => file.filename);
    if (!VenuesName || !VenuesAddress) {
      return res
        .status(400)
        .json({ error: "Both venueName and venueAddress are required." });
    }
    // Create a new Venue instance
    const newVenue = new Venues({
      VenuesName: VenuesName,
      VenuesAddress: VenuesAddress,
      VenueImage: fileNames,
      VenueSeats: VenueSeats,
      VenueDescription: VenueDescription,
    });
    // Save the new venue to the database
    const savedVenue = await newVenue.save();
    res
      .status(201)
      .json({ massege: "Add Venues add  successfully", data: savedVenue }); // Return the saved venue in the response
  } catch (error) {
    console.error("Error adding Venue:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/getAllVenues", async (req, res) => {
  try {
    const Venue = await Venues.find({});
    console.log("This is the Venues information:", Venue);
    res.json(Venue);
  } catch (error) {
    console.error("Error fetching Venues:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/getOneVenues/:id", async (req, res) => {
  const VenuesID = req.params.id;
  console.log("getOne", VenuesID);
  console.log("get", req.params.id);
  try {
    const Venue = await Venues.findOne({ _id: VenuesID });

    if (!Venue) {
      return res.status(404).json({ error: "Venues not found" });
    }

    console.log("Venues information for ID", VenuesID, ":", Venue);

    res.json({ Venue });
  } catch (error) {
    console.error("Error fetching Venues:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// router.put(
//   "/Venuesupdate/:VenuesId",
//   upload.array("VenueImage"),
//   async (req, res) => {
//     let { VenuesName, VenuesAddress, VenueDescription } = req.body;

//     console.log("Request Body:", req.body);
//     const VenuesID = req.params.VenuesId;
//     const fileNames = req.files?.map((file) => file.filename);
//     try {
//       const Venue = await Venues.findOne({ _id: VenuesID });
//       console.log("Found Venues:", Venues);

//       if (!Venue) {
//         return res.status(404).json({ error: "Venues not found" });
//       }

//       const result = await Venues.updateOne(
//         { _id: VenuesID },
//         {
//           $set: {
//             VenuesName: VenuesName,
//             VenuesAddress: VenuesAddress,
//             VenueImage: fileNames,
//             VenueDescription: VenueDescription,
//           },
//         }
//       );
//       console.log("Update Result:", result);

//       if (result.nModified === 0) {
//         return res.status(404).json({ error: "Venues not updated" });
//       }

//       res.status(200).json({ message: "Venues updated successfully" });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: "Internal server error" });
//     }
//   }
// );

router.put(
  "/Venuesupdate/:VenuesId",
  upload.array("VenueImage"),
  async (req, res) => {
    let { VenuesName, VenuesAddress, VenueSeats, VenueDescription } = req.body;

    console.log("Request Body:", req.body);
    const VenuesID = req.params.VenuesId;
    const fileNames = req.files?.map((file) => file.filename);
    try {
      const Venue = await Venues.findOne({ _id: VenuesID });
      console.log("Found Venues:", Venues);

      if (!Venue) {
        return res.status(404).json({ error: "Venues not found" });
      }

      const result = await Venues.updateOne(
        { _id: VenuesID },
        {
          $set: {
            VenuesName: VenuesName,
            VenuesAddress: VenuesAddress,
            VenueImage: fileNames,
            VenueDescription: VenueDescription,
            VenueSeats: VenueSeats,
          },
        }
      );
      console.log("Update Result:", result);

      if (result.nModified === 0) {
        return res.status(404).json({ error: "Venues not updated" });
      }

      res.status(200).json({ message: "Venues updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

module.exports = router;
