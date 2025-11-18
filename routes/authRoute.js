const express = require("express");
const router = express.Router();

// controllers
const { signUp } = require("../controllers/authController");

router.route("/signup").post(signUp);

module.exports = router;
