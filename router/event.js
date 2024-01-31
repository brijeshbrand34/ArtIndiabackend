require("../db/conn");
const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();

const multer = require("multer");
const path = require("path");

const Event = require("../model/EventSchema");

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

router.post("/addevents", upload.array("EventImage"), async (req, res) => {
  try {
    const {
      EventName,
      EventShortdescription,
      EventOrganizer,
      EventType,
      Eventdescription,
      EventPrice,
      venueId,
      eventDates,
    } = req.body;

    const EventTime = JSON.parse(eventDates);

    if (!req.files || !req.files.length) {
      return res.status(400).json({ error: "No files uploaded." });
    }

    const fileNames = req.files?.map((file) => file.filename);

    const event = new Event({
      EventId: "event" + generateUniqueId(),
      EventName: EventName,
      EventOrganizer: EventOrganizer,
      EventType: EventType,
      EventShortdescription: EventShortdescription,
      Eventdescription: Eventdescription,
      EventPrice: EventPrice,
      EventImage: fileNames,
      venueId: venueId,

      eventDates: EventTime.map((date) => ({
        date: new Date(date.date),
        times: date.times.map((time) => ({ time })),
      })),
    });
    // console.log(savedEvent);
    const savedEvent = await event.save();
    res.json(savedEvent);
  } catch (error) {
    console.error("Error adding event:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put(
  "/updateevent/:eventId",
  upload.array("EventImage"),
  async (req, res) => {
    try {
      const eventId = req.params.eventId;
      const {
        EventName,
        EventShortdescription,
        EventOrganizer,
        EventType,
        Eventdescription,
        EventPrice,
        venueId,
        eventDates,
      } = req.body;

      const EventTime = JSON.parse(eventDates);

      if (!req.files || !req.files.length) {
        return res.status(400).json({ error: "No files uploaded." });
      }

      const fileNames = req.files.map((file) => file.filename);

      const updatedEvent = await Event.findByIdAndUpdate(
        eventId,
        {
          EventName: EventName,
          EventOrganizer: EventOrganizer,
          EventType: EventType,
          EventShortdescription: EventShortdescription,
          Eventdescription: Eventdescription,
          EventPrice: EventPrice,
          EventImage: fileNames,
          venueId: venueId,
          eventDates: EventTime.map((date) => ({
            date: new Date(date.date),
            times: date.times.map((time) => ({ time })),
          })),
        },
        { new: true } // Return the updated document
      );

      if (!updatedEvent) {
        return res.status(404).json({ error: "Event not found" });
      }

      res.json({ message: "Event updated successfully", updatedEvent });
    } catch (error) {
      console.error("Error updating event:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.get("/getAllEvents", async (req, res) => {
  try {
    const Events = await Event.find({});
    console.log("This is the Event information:", Events);
    res.json(Events);
  } catch (error) {
    console.error("Error fetching Event:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/getOneEvent/:id", async (req, res) => {
  const EventID = req.params.id;
  // console.log("getOne", EventCountsID);
  console.log("get", req.params.id);
  try {
    const Events = await Event.findOne({ _id: EventID });

    if (!Events) {
      return res.status(404).json({ error: "Event not found" });
    }

    console.log("Event information for ID", req.params.id, ":", Events);

    res.json({ Events });
  } catch (error) {
    console.error("Error fetching Event:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/eventpublished/:EventId", async (req, res) => {
  const eventId = req.params.EventId;
  // console.log(EventId);

  try {
    const { published } = req.body;
    // console.log(published);
    const event = await Event.findByIdAndUpdate(
      { _id: eventId },
      {
        Published: published,
      }
    );

    if (!event) {
      return res.status(404).send("Event Id Not Found");
    }

    return res
      .status(200)
      .json({ message: "event published updated successfully", data: event });
  } catch (error) {
    res.status(500).json({ error: "Internal server error in event api" });
  }
});

module.exports = router;
