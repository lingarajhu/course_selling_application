const { Router } = require("express");
const { z } = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRouter = Router();
const { userModel } = require("../db");
const { USER_SECRET_KEY } = require("../config");
const { userMiddleware } = require("../middleware/user");

userRouter.post("/signup", async (req, res) => {
  const requiredSchema = z.object({
    email: z
      .string()
      .min(2, { message: "email is too short" })
      .max(50)
      .email({ message: "Invalid email addess" }),
    password: z
      .string()
      .min(8, { message: "password is too short" })
      .max(100)
      .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
        message: "password is too week",
      }),
    firstName: z
      .string()
      .min(1, { message: "FirstName is too short" })
      .max(50, { message: "FirstName is too long" }),
    lastName: z
      .string()
      .min(1, { message: "LastName is too short" })
      .max(50, { message: "LastName is too long" })
      .regex(/^[a-zA-Z\s]*$/, {
        message: "LastName can only contain letters and spaces",
      }),
  });

  const parsedDataWithSucess = requiredSchema.safeParse(req.body);

  if (!parsedDataWithSucess.success) {
    return res.status(403).json({
      message: "Incorrect Formate",
      error: parsedDataWithSucess.error.issues[0].message,
    });
  }

  const { email, password, firstName, lastName } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await userModel.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    res.status(200).json({
      message: "User created sucesfulley",
    });
  } catch (error) {
    res.status(403).json({
      message: "User already exist",
    });
  }
});

userRouter.post("/signin", async (req, res) => {
  const requriedSchema = z.object({
    email: z
      .string()
      .min(2, { message: "Email is too short" })
      .max(40, { message: "Email is too long" })
      .email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "password must contain atleast 8 character" })
      .max(50)
      .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
        message: "password is to week",
      }),
  });

  const parsedDataWithSucess = requriedSchema.safeParse(req.body);
  const { email, password } = req.body;

  if (!parsedDataWithSucess.success) {
    return res.status(403).json({
      message: "Incorrect Formate",
      error: parsedDataWithSucess.error.issues[0].message,
    });
  }

  try {
    const respond = await userModel.findOne({
      email,
    });

    if (!respond) {
      return res.status(403).json({
        message: "User does not exist",
      });
    }

    const matchPassword = await bcrypt.compare(password, respond.password);

    if (matchPassword) {
      const token = jwt.sign(
        {
          id: respond._id.toString(),
        },
        USER_SECRET_KEY
      );

      res.status(200).json({
        message: "User logged in",
        token,
      });
    } else {
      res.status(403).json({
        message: "Invalide Password",
      });
    }
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
});

userRouter.post("/course", userMiddleware, (req, res) => {
  const userId = req.userId;

  res.json({
    message: "user can purchase course",
  });
});

module.exports = {
  userRouter: userRouter,
};
