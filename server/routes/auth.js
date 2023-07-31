const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");
require("dotenv").config();

router.post(
  "/createuser",
  [
    body("name", "enter valid name").isLength({ min: 3 }),
    body("email", "enter valid email").isEmail(),
    body("password", "password length is small").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      //checking exists or not

      let user = await User.findOne({ email: req.body.email });

      if (user) {
        return res.status(400).json({ error: "exists" });
      }
      const salt = await bcrypt.genSalt(10);
      secPass = await bcrypt.hash(req.body.password, salt);

      user = await User.create({
        name: req.body.name,

        password: secPass,
        email: req.body.email,
      });

      const data = {
        user: {
          id: user.id,
        },
      };

      const token = jwt.sign(data, process.env.JWT_SECRET);

      //   res.json(user);
      res.json({ token });
    } catch (err) {
      console.log(err.message);
      res.status(500).send("error");
    }
  }
);

//login

router.post(
  "/login",
  [
    body("email", "enter valid email").isEmail(),
    body("password", "password length is small").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "enter correct details" });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(400).json({ error: "enter correct details" });
      }

      const data = {
        user: {
          id: user.id,
        },
      };

      const token = jwt.sign(data, process.env.JWT_SECRET);

      res.json({ token });
    } catch (err) {
      console.log(err.message);
      res.status(500).send("error");
    }
  }
);

router.post("/getuser", fetchuser, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user)
  } catch (error) {
    console.log(error.message);
    res.status(500).send("error");
  }
});

module.exports = router;
