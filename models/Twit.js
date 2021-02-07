const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const config = require("config");

const TwitSchema = new Schema({
  post: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  comment: {
    type: Schema.Types.ObjectId,
    ref: "comment",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Twit = mongoose.model("twit", TwitSchema);
