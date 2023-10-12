var cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
dotenv.config({
  path: "./config.env",
});
require("./db/conn");
const express = require("express");
// const User = require("./model/UserSchema");
const PORT = process.env.PORT;
const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true, }));

// Middleware for parsing JSON data

app.use(express.json());

app.use(cors());

app.use("/images", express.static("assets/uploads"));

app.use(require("./router/admin"));
app.use(require("./router/blog"));
app.use(require("./router/footer"));
app.use(require("./router/websiteHeader"));
app.use(require("./router/ourSpaces"));
app.use(require("./router/herosection"));
app.use(require("./router/sectionTopDescription"));
app.use(require("./router/community"));
app.use(require("./router/contact"));
app.use(require("./router/categories"));
app.use(require("./router/pages"));
app.use(require("./router/aboutus"));
app.use(require("./router/event"));
app.use(require("./router/venues"));
app.use(require("./router/order"));





app.use(express.urlencoded({ extended: true }));
// app.get("/*", function (req, res) {
//   res.sendFile(path.join(__dirname, "build", "index.html"));
// });

app.get("/", (req, res) => {
  res.send("this is home page");
});
app.listen(PORT, () => {
  console.log(`Server is running at port number ${PORT}`);
});
