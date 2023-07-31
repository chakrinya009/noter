const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./db");
// const User = require("./models/User.js");
// const userRoute = require("./routes/users");

//intialise app with express

const app = express();

//middlewares

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static("public")); //static files

//view engine

app.set("view engine", "ejs");
//app.set('views','myviews') //default views if we want in different folder

//connect to db
connectDB();

//routes

// app.use("/users", userRoute);

app.get("/", (req, res) => {
  res.send("home page");
});

//run server

app.listen(process.env.PORT, () => {
  console.log(`server running on port ${process.env.PORT}`);
});
