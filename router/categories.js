require("../db/conn");
const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const path = require("path");

const multer = require("multer");


const Categories = require("../model/CategoriesSchema");

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

router.post("/Categorieadd", upload.array("CategoriesImage"), (req, res) => {
    const { CategorieTitle, SubCategorieTitle } = req.body;
    console.log(req.body);
    const fileNames = req.files?.map((file) => file.filename);

    const newData = new Categories({
        CategoriesId: "Cat" + generateUniqueId(),
        CategoriesTitle: CategorieTitle,
        SubCategoriesName: SubCategorieTitle,
        CategoriesImage: fileNames,
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
router.get("/getCategories", async (req, res) => {
    try {
        const Categorie = await Categories.find({});
        if (Categorie) {
            console.log("This is Categories information:", Categorie);
            res.json(Categorie);
        } else {
            res.status(404).json({ error: "Categories information is not exit" })
        }
    } catch (error) {
        console.error("Error fetching community data:", error);
        res.status(500).json({ error: "Internal Server Error in community" });
    }
});

router.get("/getOneCategories/:id", async (req, res) => {
    const CategoriesId = req.params.id;

    try {
        const Categorie = await Categories.findById(CategoriesId);

        if (!Categorie) {
            return res.status(404).json({ error: "Categorie not found" });
        }

        console.log("Community information for ID", CategoriesId, ":", Categorie);

        res.json({ Categorie }); // Send the Product as JSON response
    } catch (error) {
        console.error("Error fetching Categorie:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.put("/updateCategorie/:id", upload.array("CategoriesImage"), async (req, res) => {
    const { CategorieTitle, SubCategorieTitle } = req.body;
    const CategorieId = req.params.id;
    console.log(CategorieId);

    try {
        if (!req.files || !req.files.length) {
            return res.status(400).json({ error: "No files uploaded." });
        }

        const fileNames = req.files.map((file) => file.filename);

        const result = await Categories.findByIdAndUpdate(CategorieId,
            {
                CategoriesTitle: CategorieTitle,
                SubCategoriesName: SubCategorieTitle,
                CategoriesImage: fileNames,
            }
        );
        if (result.n === 0) {
            return res.status(404).json({ error: "Categories not found" });
        }
        res.status(200).json({ message: "Categories updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}
);

router.delete("/deleteCategorie/:id", (req, res) => {
    Categorie = Categories.findByIdAndDelete(req.params.id)
      .then((Categorie) => {
        if (!Categorie) {
          return res.status(404).send("Not Found");
        }
        res.send("Deleted Successfully");
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  });
  
  router.put('/publishCategories/:Id', async (req, res) => {
    const { published } = req.body;
    const CategoriesId = req.params.Id;
  
    try {
      const result = await Categories.updateOne(
        { _id: CategoriesId },
        {
          $set: {
            Published: published,
          },
        }
      );
  
      console.log("result-----", result);
  
      if (result.n === 0) {
        return res.status(404).json({ error: 'Categories not found' });
      }
  
      res.status(200).json({ message: 'Categories published successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  module.exports = router;