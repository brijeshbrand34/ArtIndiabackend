const mongoose = require("mongoose");

    const AboutusSchema = new mongoose.Schema(
        {
            BGTitle: { type: String, required:true},
            BGSubTitle: {type: String, required:true},
            BGDescription: {type: String},
            BGImage: {type: [String], required:true},

            FirstTitle: {type: String, required:true},
            FirstSubTitle: {type: String, required:true},
            FirstDescription: {type: String},
            FirstImage: {type: [String],required:true},

            SecondTitle: {type: String, required:true},
            SecondSubTitle: {type: String, required:true},
            SecondImage: {type: [String],required:true},
            SecondDescription: {type: String},

            CeoDeatils: {type: String,required:true},
            CeoImage: {type: [String],required:true},
            ShortDescription: {type: String,required:true},
            Description: {type: String,required:true},
        },
        { timestamps: true }
    );
    
    const Aboutus = mongoose.model("Aboutus", AboutusSchema);
    module.exports = Aboutus;