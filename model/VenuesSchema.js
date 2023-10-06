const mongoose = require("mongoose");

    const VenuesSchema = new mongoose.Schema(
        {
            VenuesName: { type: String, required:true},
            VenuesAddress: {type: String, required:true},
        },
        { timestamps: true }
    );
    
    const Venues = mongoose.model("Venues", VenuesSchema);
    module.exports = Venues;