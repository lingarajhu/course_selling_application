const express = require("express");
const mongoose = require("mongoose");
const app = express();
const { userRouter } = require("./routes/user");
const { courseRouter } = require("./routes/courses");
const { adminRouter } = require("./routes/admin");

app.use("/api/v1/courses", courseRouter);
app.use("api/v1/admin", adminRouter);
app.use("/api/v1/user", userRouter);

async function main() {
  await mongoose.connect(
    "mongodb+srv://lingrajhu0203:e6mI9AviXDtcBRHk@cluster0.he8qb.mongodb.net/coursera-app"
  );
  app.listen(3006, () => {
    console.log("Server is running at https://localhost:3006");
  });
  console.log("app is running");
}

main();
