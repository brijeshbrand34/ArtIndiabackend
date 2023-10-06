require("../db/conn");
const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();

const multer = require("multer");
const path = require("path");

const Admin = require("../model/AdminSchema");
const Authenticates = require("../middleware/authenticateAdmin");

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


// admin add
router.post("/AdminRegister",upload.array("adminProfilePicture"),async (req, res) => {
    const { adminName, adminEmail, adminPassword } = req.body;
    if (!adminName || !adminEmail || !adminPassword) {
        return res.status(422).json({ error: "Please fill the fields properly",}
      );
    }
    const fileNames = req.files?.map((file) => file.filename);
    try {
        const AdminExist = await Admin.findOne({
          adminEmail: adminEmail,
        });
        console.log(AdminExist);
        if (AdminExist) {
          return res.status(422).json({
            error: "Email already exists",
          });
        }
        const Admin2 = new Admin({
          adminName: adminName,
          adminEmail: adminEmail,
          adminPassword: adminPassword,
          adminProfilePicture: fileNames,
        });

        await Admin2.save();
        res.status(201).json({message: "Admin register successfully",});
    } catch (err) {
        console.log(err);
        res.status(500).json({error: "Internal server error",});
    }
  }
);
//admin login
router.post("/adminSignin", async (req, res) => {
  try {
    let token;
    const { adminEmail, adminPassword } = req.body;
    if (!adminEmail || !adminPassword) {
      return res.status(400).json({ error: "plz filled the data" });
    }

    const AdminLogin = await Admin.findOne({ adminEmail: adminEmail });

    if (AdminLogin) {
      const isMatch = await bcrypt.compare(
        adminPassword,
        AdminLogin.adminPassword
      );
      token = await AdminLogin.generateAuthToken();

      res.cookie("jwtoken", token, {
        expires: new Date(Date.now() + 2589000000),
        // httpOnly:true
      });
      if (!isMatch) {
        res.status(400).json({ error: "invalid credentials" });
      } else {
        res.json({ message: "Admin Signin successfully" });
      }
    } else {
      res.status(400).json({
        error: "invalid Credentials",
      });
    }
  } catch (err) {
    console.log(err);

    res.status(500).json({ error: "Internal server error" });
  }
});

//get admin data
router.get("/getAdminData", async (req, res) => {
  console.log("admin data is fetched");
  const Admins = await Admin.find();
  res.send(Admins);
});

router.get("/admin", Authenticates, (req, res) => {
  console.log("admin is authenticated");
  res.send(req.rootUser);
});
// Delete
router.delete("/deleteAdmin/:AdminId", async (req, res) => {
  console.log("Delete Admin");
  const AdminId = req.params._id;
  //   const updates = req.body;
  try {
    const deletedAdmin = await Admin.findOneAndDelete({
      AdminId: AdminId,
    });
    if (!deletedAdmin) {
      return res.status(404).json({ error: "Admin not found" });
    }
    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update
router.put("/AdminUpdate/:AdminId", async (req, res) => {
  const AdminId = req.params._id;
  const updates = req.body;

  try {
    const result = await Admin.updateOne(
      { AdminId: AdminId },
      { $set: updates }
    );

    if (result.n === 0) {
      return res.status(404).json({ error: "Admin not found" });
    }

    res.status(200).json({ message: "Admin updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/adminlogout", (req, res) => {
  console.log("this is logout page");
  res.clearCookie("jwtoken", { path: "/" });
  res.status(200).send("Admin logout");
});

module.exports = router;
