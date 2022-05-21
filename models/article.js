const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const schema = mongoose.Schema;
// Schema Definition
//TODO: Assignment: Add Validate rule for email to be unique

const ArticleSchema = mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  file: {
    type: String,
  },
  comments: [{
    from: {
      type: schema.Types.ObjectId,
      ref: 'User'
    },
    text: {
      type: String,
      required: true
    },
  }],
  likes: {
    type: Number,
    default: 1
  },
  association: {
    type: schema.Types.ObjectId,
    ref: 'Association'
  },
});



const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;