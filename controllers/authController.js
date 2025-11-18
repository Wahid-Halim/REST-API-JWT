const signUp = (req, res, next) => {
  res.json({
    status: "success",
    message: "Signup route working",
  });
};

module.exports = { signUp };
