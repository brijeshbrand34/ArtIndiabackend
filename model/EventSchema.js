const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  EventId:{type:String,require:true},
  EventOrganizer:{type:String},
  EventType:{type:String, require:true}, 
  EventName: {type: String, require: true,},
  EventShortdescription: { type: String,},
  Eventdescription: { type: String,},
  EventPrice:{type:Number,},
  EventImage:{type:[String]},
  venueId: {type: mongoose.Schema.Types.ObjectId, ref: 'Venue',},
  Published:{type:Boolean, default:true},
  eventDates: [
    {
      date: {
        type: Date,
        required: true,
      },
      times: [
        {
          time: {
            type: String,
            required: true,
          },
          
        },
      ],
    },
  ],
});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
