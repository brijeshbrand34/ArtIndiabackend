require("../db/conn");
const express = require("express");
const path = require("path");
const router = express.Router();
const Socialmedia = require("../model/SocialmediaSchema");


router.get('/get-All-Socialmedia',async (req, res) =>{
    try {
        const Socialmedias = await Socialmedia.find({});
        console.log("This is the Socialmedia information:", Socialmedias);
        res.json(Socialmedias);
    } catch (error) {
        console.error("Error fetching Socialmedias:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

router.get('/get-Socialmedia/:Id',async (req, res) =>{
    const SocialmediaId = req.params.Id;
    try {
        const OneSocialmedia = await Socialmedia.findOne({_id:SocialmediaId});
        console.log("This is the Socialmedia information:", OneSocialmedia);
        res.json(OneSocialmedia);
    } catch (error) {
        console.error("Error fetching Socialmedia:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

router.put("/socialmedia-update/:Id", async (req, res) => {
    const SocialmediaId = req.params.Id;
    const {Link } = req.body;
    console.log(Link, 'update')

    try {
        const result = await Socialmedia.updateOne(
            {_id: SocialmediaId },
            {
                $set: {
                    Link: Link
                }
            }
        );

        if (result.n === 0) {
            return res.status(404).json({ error: "Socialmedia not found" });
        }

        res.status(200).json({ message: "Socialmedia updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});