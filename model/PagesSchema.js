const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const  PagesSchema= new mongoose.Schema({
    PagesId: { type: String, required: true , unique: true, },
    PagesTitle: { type: String, required: true },
    PagesLink: { type: String, required: true },
    PagesImg: { type: [String], required: true },
    PagesVideo: { type: [String], required: true },
    PagesGallary: { type: [String], required: true },
    PagesBannerVideo: { type: [String], required: true },
    PagesDescription: { type: {String} },
   
},{
    timestamps:true  
})


const Pages = mongoose.model('Pages', PagesSchema);
module.exports = Pages;