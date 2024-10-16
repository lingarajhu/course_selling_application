require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const { userRouter } = require("./routes/user");
const { courseRouter } = require("./routes/courses");
const { adminRouter } = require("./routes/admin");

app.use(express.json());
app.use("/api/v1/courses", courseRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/user", userRouter);

async function main() {
  await mongoose.connect(process.env.MONGOO_URL);
  app.listen(3006, () => {
    console.log("Server is running at https://localhost:3006");
  });
  console.log("app is running");
}

main();
