const { Router } = require("express");
const adminRouter = Router();
const { adminModel, courseModel } = require("../db");
const { z } = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ADMIN_SECRET_KEY } = require("../config");
const { adminMiddleware } = require("../middleware/admin");

adminRouter.post("/signup", async (req, res) => {
  const requiredSchema = z.object({
    email: z
      .string()
      .min(2, { message: "Email is too short" })
      .max(50, { message: "Email is too long" })
      .email(),
    password: z
      .string()
      .min(8, { message: "Password is too short" })
      .max(100, { message: "Password is too long" })
      .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
        message: "password is to week",
      }),
    firstName: z
      .string()
      .min(1, { message: "First Name is required" })
      .max(100, { message: "firstName is too long" }),
    lastName: z
      .string()
      .min(1, { message: "Last Name is required" })
      .max(100, { messsage: "Last name is too long" }),
  });

  const parsedDataWithSucess = requiredSchema.safeParse(req.body);
  const { email, password, firstName, lastName } = req.body;

  if (!parsedDataWithSucess.success) {
    return res.status(403).json({
      message: "Incorrect Formate",
      error: parsedDataWithSucess.error.issues[0].message,
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await adminModel.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    res.status(200).json({
      message: "Admin created sucesfulley",
    });
  } catch (error) {
    res.status(403).json({
      message: "User already exist",
    });
  }
});

adminRouter.post("/signin", async (req, res) => {
  const requiredSchema = z.object({
    email: z
      .string()
      .min(2, { message: "Email is too short" })
      .max(50, { message: "Email is too long" })
      .email(),
    password: z
      .string()
      .min(8, { message: "Password is too short" })
      .max(100, { message: "Password is too long" })
      .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
        message: "password is to week",
      }),
  });

  const parsedDataWithSucess = requiredSchema.safeParse(req.body);
  const { email, password } = req.body;

  if (!parsedDataWithSucess.success) {
    return res.status(403).json({
      message: "Incorrect Formate",
      error: parsedDataWithSucess.error.issues[0].message,
    });
  }

  try {
    const respond = await adminModel.findOne({
      email,
    });

    if (!respond) {
      return res.status(403).json({
        message: "Admin does not exist",
      });
    }

    const matchPassword = await bcrypt.compare(password, respond.password);

    if (matchPassword) {
      const token = jwt.sign(
        {
          id: respond._id.toString(),
        },
        ADMIN_SECRET_KEY
      );

      res.status(200).json({
        message: "Admin logged in",
        token,
      });
    } else {
      res.status(403).json({
        message: "Invalide Password",
      });
    }
  } catch (error) {
    res.status(403).json({
      message: "Admin already exist",
    });
  }
});

adminRouter.post("/course", adminMiddleware, async (req, res) => {
  const adminId = req.adminId;
  console.log(adminId);

  const { title, description, price, imageUrl } = req.body;

  try {
    const course = await courseModel.create({
      title,
      description,
      price,
      imageUrl,
      creatorId: adminId,
    });

    res.status(200).json({
      message: "Course created sucesfulley",
      couseId: course._id,
    });
  } catch (error) {
    res.status(403).json({
      message: "Invalid format",
    });
  }
});

adminRouter.put("/course", adminMiddleware, async (req, res) => {
  const adminId = req.adminId;

  const { title, description, price, imageUrl, courseId } = req.body;

  const updateCourse = await courseModel.updateOne(
    {
      _id: courseId,
      creatorId: adminId,
    },
    {
      title,
      description,
      price,
      imageUrl,
    }
  );

  res.json({
    message: "Course updated",
    updateCourse: updateCourse._id,
  });
});

adminRouter.get("/course/bulk", adminMiddleware, async (req, res) => {
  const adminId = req.adminId;

  try {
    const courses = await courseModel.find({
      creatorId: adminId,
    });
    res.json({
      message: "Admin can get the all the courses that he has",
      courses,
    });
  } catch (error) {
    res.status(404).json({
      message: "No courses exist",
    });
  }
});

module.exports = {
  adminRouter,
};
