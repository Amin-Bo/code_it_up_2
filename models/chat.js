const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const schema=mongoose.Schema;
// Schema Definition
//TODO: Assignment: Add Validate rule for email to be unique

const ChatSchema = mongoose.Schema({
  messages: [
    {
      from: { type: schema.Types.ObjectId, ref:'User'},
      to: { type: schema.Types.ObjectId, ref:'User'},
      message: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    }
  ]
});



const Chat = mongoose.model("Chat", ChatSchema);

module.exports = Chat;
