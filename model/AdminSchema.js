const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const SECRET_KEY = process.env.SECRET_KEY;
const AdminSchema = new mongoose.Schema(
  {
    adminName: {
      type: String,
      required: true,
    },
    adminEmail: {
      type: String,
      required: true,
    },
    adminPassword: {
      type: String,
      required: true,
    },
    adminProfilePicture: {
      type: [String],
    },
    tokens: [
      {
        token: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

AdminSchema.pre("save", async function (next) {
  console.log("hi from inside");
  if (this.isModified("adminPassword")) {
    this.adminPassword = await bcrypt.hash(this.adminPassword, 12);
    // this.confirmPassword = await bcrypt.hash(this.confirmPassword, 12);
  }
  next();
});

AdminSchema.methods.generateAuthToken = async function () {
  try {
    let token = jwt.sign({ _id: this._id }, SECRET_KEY);
    console.log("token response");
    this.tokens = this.tokens.concat({
      token: token,
    });
    await this.save();
    return token;
  } catch (err) {
    console.log(err);
  }
};

const Admin = mongoose.model("Admin", AdminSchema);
module.exports = Admin;
