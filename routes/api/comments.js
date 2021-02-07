require("dotenv").config();
const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const Twit = require("../../models/Twit");
const Comment = require("../../models/Comment");
const auth = require("../../middleware/auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Create
// @route   POST api/users
// @desc    Create a User
// @access  Public
router.post("/", auth, async (req, res) => {
  try {
    const createComment = await new Comment({
      comment: req.body.comment,
      user: req.user.id,
      twit: req.body.twit,
    });
    const saveComment = await createComment.save();
    res.status(200).json(saveComment);
  } catch (err) {
    res
      .status(400)
      .json({ msg: "Sorry but we had an issue with your comment" });
  }
});

router.get("/", async (req, res) => {
  const findAll = await Comment.find();
  res.status(200).json(findAll);
});

router.get("/:id", async (req, res) => {
  console.log(req.params);
  try {
    const findComments = await Comment.find({ twit: req.params.id })
      .populate({
        path: "user",
        select: { _id: 1, username: 1 },
      })
      .sort({ date: -1 });
    res.status(200).json(findComments);
  } catch (err) {
    res.status(400).json({ msg: "Error finding comments" });
  }
});

module.exports = router;
