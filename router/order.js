require("../db/conn");
const jwt = require("jsonwebtoken");
const express = require("express");
const path = require("path");
const router = express.Router();
const Orders = require("../model/OrderSchema");

// const mail = require("../nodemailer/nodemailer");

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

router.post("/CreateOrder", async (req, res) => {
  try {
    const {
      OrderUserName,
      OrderEventId,
      EventDate,
      EventTime,
      UserEmail,
      UserMobile,
      // Ordercount,
      OrderPrice,
      Numberofseat,
    } = req.body;
    const Order = new Orders({
      OrderId: "order" + generateUniqueId(),
      OrderUserName: OrderUserName,
      OrderEventId: OrderEventId,
      EventDate: EventDate,
      EventTime: EventTime,
      UserEmail: UserEmail,
      UserMobile: UserMobile,
      // Ordercount: Ordercount,
      OrderPrice: OrderPrice,
      Numberofseat: Numberofseat,
    });
    const savedOrder = await Order.save();
    // if (res.status(200) || res.status(201)) {
    //   mail.send();
    // }

    res.json({ message: "Order created sucessfully", savedOrder });
  } catch (error) {
    console.error("Error adding event:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/getAllOrder", async (req, res) => {
  try {
    const Order = await Orders.find({});
    console.log("This is the Order information:", Order);
    res.json(Order);
  } catch (error) {
    console.error("Error fetching Order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/getOrder/:OrderId", async (req, res) => {
  const OrderID = req.params.OrderId;
  try {
    const Order = await Orders.findOne({ OrderId: OrderID });
    console.log("This is the Order information:", Order);
    res.json(Order);
  } catch (error) {
    console.error("Error fetching Order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
module.exports = router;
