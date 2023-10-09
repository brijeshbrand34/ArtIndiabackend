// const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const path = require("path");

const multer = require("multer");
require("../db/conn");
const Pages = require('../model/PagesSchema');

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

router.post('/Pagesadd', upload.fields([ { name: 'pageimg', maxCount: 1 }, 
    { name: 'pagevideo', maxCount: 1 }, { name: 'gallery', maxCount: 1 }, { name: 'videoimage', maxCount: 1 }]), async (req, res) => {
    let { Pagestitle, Pagelink, Pagesdescription } = req.body;

    console.log('Request Body:', req.body);
    // const PagesID = req.params.PagesId;
    if (!Pagestitle || !Pagelink || !Pagesdescription) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const page = new Pages({
            PagesId:'page'+generateUniqueId(),
            PagesTitle: Pagestitle,
            PagesLink: Pagelink,
            PagesDescription: Pagesdescription,
            PagesImg: req.files['pageimg'][0].filename, 
            PagesVideo: req.files['pagevideo'][0].filename,
            PagesGallary: req.files['gallery'][0].filename, 
            PagesBannerVideo: req.files['videoimage'][0].filename,
        });
        const savedpages = await page.save();
        console.log('Found pages:', savedpages);

        if (!page) {
            return res.status(404).json({ error: 'Pages not found' });
        }
        res.status(200).json({ message: 'Pages added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/getAllPages', async (req, res) => {
    try {
        const Page = await Pages.find({});
        console.log("This is the Pages information:", Page);
        res.json(Page);
    } catch (error) {
        console.error("Error fetching Pages:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/getOnePages/:id', async (req, res) => {
    const PagesID = req.params.id;
    console.log("getOne", PagesID)
    console.log("get", req.params.id)
    try {
        const Page = await Pages.findOne({ _id: PagesID });

        if (!Page) {
            return res.status(404).json({ error: "Pages not found" });
        }

        console.log("Pages information for ID", PagesId, ":", Page);

        res.json({ Pages });
    } catch (error) {
        console.error("Error fetching Career:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.put('/Pagesupdate/:PagesId', upload.fields([ { name: 'pageimg', maxCount: 1 }, 
    { name: 'pagevideo', maxCount: 1 }, { name: 'gallery', maxCount: 1 }, { name: 'videoimage', maxCount: 1 }]), async (req, res) => {
    let { Pagestitle, Pagelink, Pagesdescription } = req.body;

    console.log('Request Body:', req.body);
    const PagesID = req.params.PagesId;

    try {
        const page = await Pages.findOne({ _id: PagesID });
        console.log('Found page:', page);

        if (!page) {
            return res.status(404).json({ error: 'Pages not found' });
        }

        // Update the Pages
        const result = await Pages.updateOne(
            { _id: PagesID },
            {
                $set: {
                    PagesTitle: Pagestitle,
                    PagesLink: Pagelink,
                    PagesDescription: Pagesdescription,
                    pageimg: req.files['pageimg'][0].filename, 
                    pagevideo: req.files['pagevideo'][0].filename,
                    gallery: req.files['gallery'][0].filename, 
                    videoimage: req.files['videoimage'][0].filename,
                },
            }
        );
        console.log('Update Result:', result);

        if (result.nModified === 0) {
            return res.status(404).json({ error: 'Pages not updated' });
        }

        res.status(200).json({ message: 'Pages updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/publishPages/:Id', async (req, res) => {
    const { published } = req.body;
    const PagesId = req.params.Id;
  
    try {
      const result = await Pages.updateOne(
        { _id: PagesId },
        {
          $set: {
            Published: published,
          },
        }
      );
  
      console.log("result-----", result);
  
      if (result.n === 0) {
        return res.status(404).json({ error: 'Pages not found' });
      }
  
      res.status(200).json({ message: 'Pages published successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
module.exports = router;