require("dotenv").config({ path: `${process.cwd()}/.env` });

const express = require("express");
const app = express();
// routes
const authRouter = require("./routes/authRoute");

app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "api working fine",
  });
});

// routes
app.use("/api/v1/auth", authRouter);

app.listen(process.env.PORT, () => console.log("Server is running"));
