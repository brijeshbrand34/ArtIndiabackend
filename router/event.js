require("../db/conn");
const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();

const multer = require("multer");
const path = require("path");

const Event = require("../model/EventSchema");

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

  router.post('/addevents', async (req, res) => {
    try {
        const {
          EventId,
          EventName,
          EventShortdescription,
          Eventdescription,
          EventPrice,
          EventImage,
          venueId,
          eventDates,
        } = req.body;
        const event = new Event({
          EventId :"abcs_sdjdsfd",
          EventName:EventName,
          EventShortdescription:EventShortdescription,
          Eventdescription:Eventdescription,
          EventPrice:EventPrice,
          EventImage,
        //   venueId:venueId,
          eventDates: eventDates.map(date => ({
            date: new Date(date.date),
            times: date.times.map(time => ({ time })),
          })),
        });
        console.log(savedEvent);
        const savedEvent = await event.save();
        res.json(savedEvent);
      } catch (error) {
        console.error('Error adding event:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
  module.exports = router;