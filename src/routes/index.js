const express = require("express");

const Router = express.Router();

// router list
const testing = require("./ping");
const authRouter = require("./auth");
const usersRouter = require("./users");
const paymentsRouter = require("./payments");
const moviesRouter = require("./movies");
const showtimesRouter = require("./showtimes");

// endpoint list
Router.use("/ping", testing);
Router.use("/auth", authRouter);
Router.use("/users", usersRouter);
Router.use("/payments", paymentsRouter);
Router.use("/movies", moviesRouter);
Router.use("/showtimes", showtimesRouter);

// notfound
Router.get("*", function (req, res) {
  res.status(404).send({
    msg: "API not found",
  });
});

module.exports = Router;
