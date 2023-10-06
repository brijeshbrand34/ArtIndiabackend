// const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const BlogSchema = new mongoose.Schema(
  {
    blogTitle: {
      type: String,
      //required:true
    },
    blogImage: {
      // type:String,
      type: [String],
      //required:true
    },
    blogTag: {
      type: String,
      //required:true
    },
    blogShortDescription: {
      type: String,
      //required:true
    },
    blogDescription: {
      type: String,
      //required:true
    },
    blogId: {
      type: String,
      //required:true
    },
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", BlogSchema);
module.exports = Blog;
