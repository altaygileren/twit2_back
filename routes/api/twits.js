require("dotenv").config();
const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const Twit = require("../../models/Twit");
const auth = require("../../middleware/auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Create
// @route   POST api/users
// @desc    Create a User
// @access  Public
router.post("/", auth, async (req, res) => {
  try {
    const createTwit = await new Twit({
      post: req.body.post,
      user: req.user.id,
    });

    const finalTwit = await createTwit.save();
    res.status(200).json(finalTwit);
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "Sorry but there seems to be an issue" });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const findAllTwits = await Twit.find()
      .populate({
        path: "user",
        select: { _id: 1, username: 1 },
      })
      .sort({ date: -1 });
    res.status(200).json(findAllTwits);
  } catch (err) {
    res.status(400).json({ msg: "Sorry but there seems to be an issue" });
  }
});

router.get("/mostrecent", async (req, res) => {
  const findTwits = await Twit.find()
    .sort({ date: -1 })
    .limit(10)
    .populate({
      path: "user",
      select: { _id: 1, username: 1 },
    })
  console.log(findTwits);
  res.status(200).json(findTwits);
});

module.exports = router;
