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

  router.post('/addevents',upload.array("EventImage"), async (req, res) => {
    try {
        const { EventName, EventShortdescription, Eventdescription, EventPrice, venueId, eventDates,} = req.body;

            if (!req.files || !req.files.length) {
              return res.status(400).json({ error: 'No files uploaded.' });
            }
        
            const fileNames = req.files.map((file) => file.filename);

        const event = new Event({
            EventId :"abcs_sdjdsfd",
            EventName:EventName,
            EventShortdescription:EventShortdescription,
            Eventdescription:Eventdescription,
            EventPrice:EventPrice,
            EventImage:fileNames,
            venueId:venueId,
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


    router.put('/updateevent/:eventId', upload.array("EventImage"), async (req, res) => {
        try {
          const eventId = req.params.eventId;
          const { EventName, EventShortdescription, Eventdescription, EventPrice, venueId, eventDates } = req.body;
      
          if (!req.files || !req.files.length) {
            return res.status(400).json({ error: 'No files uploaded.' });
          }
      
          const fileNames = req.files.map((file) => file.filename);
      
          const updatedEvent = await Event.findByIdAndUpdate(
            eventId,
            {
              EventName:EventName,
              EventShortdescription:EventShortdescription,
              Eventdescription:Eventdescription,
              EventPrice:EventPrice,
              EventImage: fileNames,
              venueId:venueId,
              eventDates: eventDates.map(date => ({
                date: new Date(date.date),
                times: date.times.map(time => ({ time })),
              })),
            },
            { new: true } // Return the updated document
          );
      
          if (!updatedEvent) {
            return res.status(404).json({ error: 'Event not found' });
          }
      
          res.json({message:"Event updated successfully", updatedEvent});
        } catch (error) {
          console.error('Error updating event:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      });
      
  module.exports = router;