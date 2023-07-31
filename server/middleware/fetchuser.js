const jwt = require("jsonwebtoken");
require("dotenv").config();

const fetchuser = async (req, res, next) => {
  const token = req.header("token");
  if (!token) {
    res.status(401).send({ err: "pls authenticate" });
  }

  try {
    const data = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ err: "pls authenticate" });
  }
};

module.exports=fetchuser