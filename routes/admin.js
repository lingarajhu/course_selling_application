const { Router } = require("express");
const adminRouter = Router();
const { adminModle } = require("../db");

adminRouter.post("/signin", (req, res) => {
  res.json({
    message: "Admine signed in",
  });
});

adminRouter.post("/signup", (req, res) => {
  res.json({
    message: "Admine signup",
  });
});

adminRouter.post("/course", (req, res) => {
  res.json({
    message: "Admine can create the courses",
  });
});

adminRouter.put("/course", (req, res) => {
  res.json({
    message: "Admin can update the course",
  });
});

adminRouter.get("/course/bulk", (req, res) => {
  res.json({
    message: "Admin can get the all the courses that he has",
  });
});

module.exports = {
  adminRouter,
};
