const { Router } = require("express");
const courseRouter = Router();
const { courseModle } = require("../db");

courseRouter.get("/preview", (req, res) => {
  res.json({
    message: "Gets the all the courses",
  });
});

courseRouter.post("/purchase", (req, res) => {
  res.json({
    message: "get purchased courses",
  });
});

module.exports = {
  courseRouter: courseRouter,
};
