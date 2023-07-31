const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");

router.post(
  "/",
  [
    body("name", "enter valid name").isLength({ min: 3 }),
    body("email", "enter valid email").isEmail(),
    body("password", "password length is small").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.sattus(400).json({ errors: errors.array() });
    }

    User.create({
      name: req.body.name,

      password: req.body.password,
      email: req.body.email,
    })
      .then((user) => res.json(user))
      .catch((err) => {console.log(err)
      res.json('enter uniqie value')});
  }   
);

module.exports = router;
