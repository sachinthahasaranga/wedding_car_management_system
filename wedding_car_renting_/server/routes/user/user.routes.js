const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../../models/user/user.model");

//Helper Functions
const getEncryptedPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

//Login Route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username: username });

    if (!user) {
      return res.status(400).json({
        status: false,
        message: "Invalid username",
      });
    } else {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ status: false, message: "Incorrect password" });
      } else {
        return res.status(200).json({
          status: true,
          role: user.role,
          username: user.username,
          _id: user._id,
          message: "Login Successful",
        });
      }
    }
  } catch (error) {
    return res.status(400).json(error);
  }
});

//Register Route
router.post("/register", async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ username: username });
    if (user) {
      return res
        .status(400)
        .json({ status: false, message: "User already exists" });
    } else {
      const newuser = new User(req.body);
      newuser.password = await getEncryptedPassword(newuser.password);
      await newuser.save();
      res.status(200).json({
        status: true,
        message: "User created successfully",
      });
    }
  } catch (error) {
    return res.status(400).json(error);
  }
});

module.exports = router;
