require("dotenv").config();
const bcrypt = require("bcryptjs");

const User = require("../db/models/user.model");
const jwt = require("jsonwebtoken");

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });
};

const signUp = async (req, res, next) => {
  try {
    const body = req.body;

    if (!["1", "2"].includes(body.userType)) {
      return res.status(400).json({
        success: "fail",
        message: "Invalid user type",
      });
    }

    const newUser = await User.create({
      userType: body.userType,
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      password: body.password,
    });

    const result = newUser.toJSON();
    delete result.password;
    delete result.deletedAt;

    result.token = generateToken({
      id: result.id,
    });

    if (!result) {
      return res.status(400).json({
        status: "fail",
        message: "Failed to crate user",
      });
    }

    return res.status(201).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide email and password",
      });
    }

    const result = await User.findOne({ where: { email } });
    if (!result) {
      return res.status(401).json({
        status: "fail",
        message: "Incorrect email and password",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, result.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: "fail",
        message: "Incorrect email and password",
      });
    }
    const userData = result.toJSON();
    delete userData.password;
    delete userData.deletedAt;
    userData.token = generateToken({ id: userData.id });
    res.status(200).json({
      status: "success",
      data: userData,
    });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
};

module.exports = { signUp, login };
