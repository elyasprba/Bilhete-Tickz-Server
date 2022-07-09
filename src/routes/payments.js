const express = require("express");

const Router = express.Router();

const paymentsControllers = require("../controllers/payments");
const { checkToken } = require("../middlewares/auth");
const { confirmPayment } = require("../models/payments");

Router.post("/", checkToken, paymentsControllers.postNewTransactions);
Router.post("/midtrans-notification", confirmPayment);

module.exports = Router;