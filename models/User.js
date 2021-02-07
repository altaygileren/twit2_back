const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const config = require("config");

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
  },
  socialMedia: {
    facebook: { type: String },
    instagram: { type: String },
    youtube: { type: String },
    twitter: { type: String },
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = User = mongoose.model("user", UserSchema);
