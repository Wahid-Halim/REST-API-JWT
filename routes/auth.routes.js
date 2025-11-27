const express = require("express");
const router = express.Router();

// controllers
const { signUp, login } = require("../controllers/auth.controller");

router.post("/sign-up", signUp);
router.post("/login", login);
module.exports = router;
