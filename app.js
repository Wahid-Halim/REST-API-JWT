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

// all routes
app.use("/api/v1/auth", authRouter);

// this must be at the end of all routes
app.use((req, res) => {
  res.status(404).json({
    status: "fail",
    message: "Route not found",
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log("Server is running"));
