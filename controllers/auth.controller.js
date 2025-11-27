require("dotenv").config();
const bcrypt = require("bcryptjs");

const User = require("../db/models/user.model");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });
};

const signUp = catchAsync(async (req, res, next) => {
  const body = req.body;

  if (!["1", "2"].includes(body.userType)) {
    throw new AppError("Invalid user type", 400);
  }

  const newUser = await User.create({
    userType: body.userType,
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    password: body.password,
  });

  if (!newUser) {
    return next(new AppError("Failed to create the user", 400));
  }

  const result = newUser.toJSON();

  delete result.password;
  delete result.deletedAt;

  result.token = generateToken({
    id: result.id,
  });

  return res.status(201).json({
    status: "success",
    data: result,
  });
});

const login = catchAsync(async (req, res,next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  const result = await User.findOne({ where: { email } });
  if (!result) {
    return next(new AppError("Incorrect email, and password", 401));
  }
  const isPasswordValid = await bcrypt.compare(password, result.password);
  if (!isPasswordValid) {
    return next(new AppError("Incorrect email, and password", 401));
  }
  const userData = result.toJSON();
  delete userData.password;
  delete userData.deletedAt;
  userData.token = generateToken({ id: userData.id });
  res.status(200).json({
    status: "success",
    data: userData,
  });
});

module.exports = { signUp, login };
