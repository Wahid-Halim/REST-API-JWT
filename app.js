require("dotenv").config({ path: `${process.cwd()}/.env` });

const express = require("express");
const app = express();
// routes
const authRouter = require("./routes/auth.routes");

// error handler
const catchAsync = require("./utils/catchAsync");
const AppError = require("./utils/appError");
const { stack } = require("sequelize/lib/utils");
const globalErrorHandler = require("./controllers/error.controller");

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "api working fine",
  });
});

// all routes
app.use("/api/v1/auth", authRouter);

// this must be at the end of all routes
app.use(
  catchAsync(async (req, res) => {
    throw new AppError(`cant find ${req.originalUrl} on this server`, 404);
  })
);

app.use(globalErrorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log("Server is running"));
