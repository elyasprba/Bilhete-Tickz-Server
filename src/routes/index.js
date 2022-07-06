const express = require("express");

const Router = express.Router();

// router list
const testing = require("./ping");
// endpoint list
Router.use("/ping", testing);

// notfound
Router.get("*", function (req, res) {
  res.status(404).send({
    msg: "API not found",
  });
});

module.exports = Router;
