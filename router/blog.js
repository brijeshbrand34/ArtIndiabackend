require("../db/conn");
const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const path = require("path");

const multer = require("multer");
require("../db/conn");
const Blog = require("../model/BlogSchema");
function generateUniqueId() {
  const date = new Date();
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  const uniqueId = `${year}${month}${day}${hours}${minutes}${seconds}`;

  return uniqueId;
}

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

// Endpoint to handle form submission
router.post("/addBlog", upload.array("blogImage"), (req, res) => {
  const { blogTitle, blogTag, blogShortDescription, blogDescription } =
    req.body;
  const fileNames = req.files?.map((file) => file.filename);

  const newData = new Blog({
    blogId: "blog" + generateUniqueId(),
    blogTitle: blogTitle,
    blogTag: blogTag,
    blogShortDescription: blogShortDescription,
    blogDescription: blogDescription,
    blogImage: fileNames,
  });

  newData
    .save()
    .then((data) => {
      console.log("Data saved to MongoDB:", data);
      res
        .status(200)
        .json({ message: "Form data and files uploaded successfully." });
    })
    .catch((err) => {
      console.error("Error saving data to MongoDB:", err);
      res.status(500).json({ error: "Failed to save form data and files." });
    });
});

router.get("/getAllBlogs", async (req, res) => {
  try {
    const Blogs = await Blog.find({});

    console.log("This is the Blog information:", Blogs);

    res.json(Blogs);
  } catch (error) {
    console.error("Error fetching Blogs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/getOneBlog/:id", async (req, res) => {
  const BlogId = req.params.id;

  try {
    const blog = await Blog.findById(BlogId);

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    console.log("Community information for ID", BlogId, ":", blog);

    res.json({ blog });
  } catch (error) {
    console.error("Error fetching Blog:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/updateBlog/:id", upload.array("blogImage"), async (req, res) => {
  const { blogTitle, blogTag, blogShortDescription, blogDescription } =
    req.body;
  const BlogId = req.params.id;
  console.log(BlogId);

  try {
    if (!req.files || !req.files.length) {
      return res.status(400).json({ error: "No files uploaded." });
    }

    const fileNames = req.files.map((file) => file.filename);

    const result = await Blog.findByIdAndUpdate(
      BlogId,

      {
        blogTitle: blogTitle,
        blogTag: blogTag,
        blogShortDescription: blogShortDescription,
        blogDescription: blogDescription,
        blogImage: fileNames,
      }
    );

    if (result.n === 0) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.status(200).json({ message: "Blog updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/deleteBlog/:id", (req, res) => {
  Blog.findByIdAndDelete(req.params.id)
    .then((blog) => {
      if (!blog) {
        return res.status(404).send("Not Found");
      }
      // res.send("Deleted Successfully");
      res.status(200).json({ message: "Deleted Successfully" });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

module.exports = router;
