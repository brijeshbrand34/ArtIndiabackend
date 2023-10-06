
const mongoose = require("mongoose");
const CategoriesSchema = new mongoose.Schema({
    CategoriesId:{type:String,require:true},
    CategoriesTitle:{type:String, require:true },
    SubCategoriesName:{type:String, require:true },
    CategoriesImage:{type:[String], require:true},
})
const Categories = mongoose.model("Categories", CategoriesSchema);
module.exports = Categories;
