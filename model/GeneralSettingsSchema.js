const mongoose = require("mongoose");
const GeneralSettingsSchema = new mongoose.Schema({
    WebsiteTitle:{type:String },
    fevicone:{type:[String]},
})
const GeneralSettings = mongoose.model("GeneralSettings", GeneralSettingsSchema);
module.exports = GeneralSettings;
