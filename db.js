const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const userSchema = new Schema({
  email: { type: String, unique: true },
  password: String,
  firstName: String,
  lastName: String,
});

const courseSchema = new Schema({
  title: String,
  description: String,
  price: Number,
  imageUrl: String,
  creatorId: ObjectId,
});

const adminSchema = new Schema({
  email: { type: String, unique: true },
  password: String,
  firstName: String,
  lastName: String,
});

const purchaseSchema = new Schema({
  courseId: ObjectId,
  userId: ObjectId,
});

const userModel = mongoose.model("user", userSchema);
const courseModel = mongoose.model("course", courseSchema);
const purchaseModel = mongoose.model("purchase", purchaseSchema);
const adminModel = mongoose.model("admin", adminSchema);

module.exports = {
  userModel,
  courseModel,
  purchaseModel,
  adminModel,
};
