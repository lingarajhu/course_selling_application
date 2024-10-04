const { Router } = require("express");
const userRouter = Router();
const { userModle } = require("../db");

userRouter.post("/signup", (req, res) => {
  res.json({
    message: "Signedup",
  });
});

userRouter.post("/signin", (req, res) => {
  res.json({
    message: "Signedin",
  });
});

userRouter.post("/course", (req, res) => {
  res.json({
    message: "user can purchase course",
  });
});

module.exports = {
  userRouter: userRouter,
};
