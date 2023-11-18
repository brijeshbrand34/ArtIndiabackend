require("../db/conn");
const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const path = require("path");

const Eventseats = require("../model/EventseatsSchema");

router.post('/addeventseats', upload.array('EventImage'), async (req, res) => {
    try {
        const { EventId, eventDates } = req.body;

        const eventSeats = new Eventseats({
            EventId: EventId,
            eventDates: eventDates.map((date) => ({
                date: new Date(date.date),
                times: date.times.map((time) => ({ time, numberOfSets: time.numberOfSets })),
            })),
        });

        const savedEventSeats = await eventSeats.save();
        res.json(savedEventSeats);
    } catch (error) {
        console.error('Error adding event seats:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/get-all-eventseats', async (req, res) => {
    try {
        const allEventSeats = await Eventseats.find();
        res.status(200).json(allEventSeats);
    } catch (error) {
        console.error('Error getting all event seats:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/eventseats/:Id', async (req, res) => {
    try {
        const { Id } = req.params;
        const eventSeat = await Eventseats.findOne({ _id: Id });

        if (!eventSeat) {
            return res.status(404).json({ error: 'Event seat not found' });
        }

        res.status(200).json(eventSeat);
    } catch (error) {
        console.error('Error getting event seat by EventId:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.put('/eventseats/:eventId', async (req, res) => {
    try {
        const { eventId } = req.params;
        const updatedEventSeat = await Eventseats.findOneAndUpdate(
            { EventId: eventId },
            { $set: req.body },
            { new: true }
        );

        if (!updatedEventSeat) {
            return res.status(404).json({ error: 'Event seat not found' });
        }

        res.status(200).json(updatedEventSeat);
    } catch (error) {
        console.error('Error updating event seat by EventId:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;