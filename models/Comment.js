const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const config = require("config");

const CommentSchema = new Schema({
  comment: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  twit: {
    type: Schema.Types.ObjectId,
    ref: "twit",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Comment = mongoose.model("comment", CommentSchema);
