const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const schema = mongoose.Schema;
// Schema Definition
//TODO: Assignment: Add Validate rule for email to be unique

const EventSchema = mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  file: {
    type: String,
  },
  participants: [{
    participant: {
      type: schema.Types.ObjectId,
      ref: 'User',
    }
  }],
  date: {
    type: String,
  },
  association: {
    type: schema.Types.ObjectId,
    ref: 'Association'
  },
});



const Event = mongoose.model("Event", EventSchema);

module.exports = Event;