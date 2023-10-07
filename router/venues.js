require('../db/conn');
const express = require('express');
const router = express.Router();
const Venues = require('../model/VenuesSchema');

router.post('/Venuesadd', async(req,res)=>{
    try {
        const { VenuesName, VenuesAddress } = req.body;
        // Validate input
        if (!venueName || !venueAddress) {
            return res.status(400).json({ error: "Both venueName and venueAddress are required." });
        }
        // Create a new Venue instance
        const newVenue = new Venues({
            VenuesName:VenuesName,
            VenuesAddress:VenuesAddress,
        });
        // Save the new venue to the database
        const savedVenue = await newVenue.save();
        res.status(201).json({massege:"Add Venues add  successfully" ,data:savedVenue}); // Return the saved venue in the response
    } catch (error) {
        console.error("Error adding Venue:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/getAllVenues', async (req, res) => {
    try {
        const Venue = await Venues.find({});
        console.log("This is the Venues information:", Venue);
        res.json(Venue);
    } catch (error) {
        console.error("Error fetching Venues:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/getOneVenues/:id', async (req, res) => {
    const VenuesID = req.params.id;
    console.log("getOne", VenuesID)
    console.log("get", req.params.id)
    try {
        const Venue = await Venues.findOne({ _id: VenuesID });

        if (!Venue) {
            return res.status(404).json({ error: "Venues not found" });
        }

        console.log("Venues information for ID", VenueId, ":", Venue);

        res.json({ Venue });
    } catch (error) {
        console.error("Error fetching Venues:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.put('/Venuesupdate/:VenuesId', async (req, res) => {
    let { VenuesName, VenuesAddress } = req.body;

    console.log('Request Body:', req.body);
    const VenuesID = req.params.VenuesId;

    try {
        const Venue = await Venues.findOne({ _id: VenuesID });
        console.log('Found Venues:', Venues);

        if (!page) {
            return res.status(404).json({ error: 'Venues not found' });
        }

        const result = await Venues.updateOne(
            { _id: VenuesID },
            {
                $set: {
                    VenuesName: VenuesName,
                    VenuesAddress: VenuesAddress,
                },
            }
        );
        console.log('Update Result:', result);

        if (result.nModified === 0) {
            return res.status(404).json({ error: 'Venues not updated' });
        }

        res.status(200).json({ message: 'Venues updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});