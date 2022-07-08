const express = require("express");

const Router = express.Router();

// router list
const testing = require("./ping");
const authRouter = require("./auth");
const usersRouter = require("./users");
const paymentsRouter = require("./payments");
// endpoint list
Router.use("/ping", testing);

// notfound
Router.use("/auth", authRouter);
Router.use("/users", usersRouter);
Router.use("/payments", paymentsRouter);
// Router.get("*", function (req, res) {
//   res.status(404).send({
//     msg: "API not found",
//   });
// });

module.exports = Router;
