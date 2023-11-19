const express = require("express");
const { UserModel } = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const userRouter = express.Router();

userRouter.get("/", (req, res) => {
  res.send("all the users");
});

userRouter.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  bcrypt.hash(password, 5, async function (err, hash) {
    if (err) return req.send({ message: "something went wrong" });
    try {
      let user = new UserModel({ name, email, password: hash });
      await user.save();
      res.send({ message: "User Created"});
    } catch (error) {
      res.send({ message: err.message });
    }
  });
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
    let option ={
      expiresIn:"3m"
    }

  try {
    let data = await UserModel.find({ email });
    if (data.length > 0) {
      let token = jwt.sign({ userId: data[0]._id }, process.env.SECRET_KEY,option);
      bcrypt.compare(password, data[0].password, function (err, result) {
        if (err)
          return res.send({
            message: "Something went wrong:" + err,
            status: 0,
          });
        if (result) {
          res.send({
            message: "User Loggedin Successfully",
            token: token,
            
          });
        } else {
          res.send({ message: "Invalid userid or password" });
        }
      });
    } else {
      res.send({ message: "User does not exists" });
    }
  } catch (error) {
    res.send({ message: error.message });
  }
});

module.exports = { userRouter };
