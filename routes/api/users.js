require("dotenv").config();
const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const auth = require("../../middleware/auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Create
// @route   POST api/users
// @desc    Create a User
// @access  Public
router.post("/", async (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }
  const userEmail = await User.findOne({ email }).then((user) => {
    if (user) return res.status(400).json({ msg: "User email already exists" });
  });
  const userName = await User.findOne({ username }).then((user) => {
    if (user) return res.status(400).json({ msg: "Username already exists" });
  });
  if (!userEmail && !userName) {
    const newUser = new User({
      email,
      username,
      password,
    });
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser.save().then((user) => {
          jwt.sign({ id: user.id }, process.env.jwtSecret, (err, token) => {
            if (err) throw err;
            res.json({
              token,
              user: {
                id: user.id,
                email: user.email,
                username: user.username,
              },
            });
          });
        });
      });
    });
  }
});

// Update
// @route   PUT api/users
// @desc    Update a User
// @access  Private
router.put("/", auth, async (req, res) => {
  const updatedUser = await User.findOneAndUpdate(
    { _id: req.user.id },
    { $set: req.body },
    { new: true }
  )
    .populate({
      path: "reviews",
      populate: {
        path: "business",
        model: "business",
        select: { _id: 1, name: 1 },
      },
      populate: {
        path: "user",
        model: "user",
        select: { _id: 1, username: 1 },
      },
      options: { sort: { date: -1 } },
    })
    .lean()
    .select("-password")
    .then((user) => res.json(user));
});

// @route   POST api/users/auth
// @desc    Authenticate User
// @access  Public

router.post("/auth", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ msg: "Please make sure to fill in all fields" });
  }
  User.findOne({ username }).then((user) => {
    if (!user) return res.status(400).json({ msg: "User does not exist" });

    bcrypt.compare(password, user.password).then((passwordMatch) => {
      if (!passwordMatch)
        return res.status(400).json({ msg: "Sorry, incorrect password" });

      jwt.sign({ id: user.id }, process.env.jwtSecret, (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
          },
        });
      });
    });
  });
});

// Delete
// @route   DELETE api/users
// @desc    Delete a User
// @access  Public
router.delete("/:id", (req, res) => {
  Post.findByIdAndDelete(req.params.id).catch((err) => res.status(404));

  res.send("The Item was deleted");
});

// Get all users
router.get("/userz", async (req, res) => {
  const findAll = await User.find();
  res.status(200).json(findAll);
});

// Get
// @route   GET api/auth/user/:id
// @desc    Get specific user
// @access  Public
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).select("-password").exec();

  res.status(200).json({
    _id: user._id,
    username: user.username,
  });
});

// Get
// @route   GET api/auth/user
// @desc    Get user
// @access  Private
router.get("/", auth, async (req, res) => {
  const id = req.user.id;
  const user = await User.findById(id).select("-password").exec();

  const data = {
    _id: user._id,
    username: user.username,
  };
  res.status(200).send(data);
});

module.exports = router;
