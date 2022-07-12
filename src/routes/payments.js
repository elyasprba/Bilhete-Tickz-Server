const express = require("express");

const Router = express.Router();

const paymentsControllers = require("../controllers/payments");
const { checkToken } = require("../middlewares/auth");
// const { confirmPayment } = require("../models/payments");

Router.post("/", checkToken, paymentsControllers.postNewTransactions);
Router.patch("/:id", checkToken, paymentsControllers.paymentConfirm);
Router.get("/check", checkToken, paymentsControllers.unpaid);
Router.get("/cancel", checkToken, paymentsControllers.cancelPay);
Router.get("/tickets/:id", checkToken, paymentsControllers.getTransactionTikects);
Router.get("/history", checkToken, paymentsControllers.getHistoryTransaction);
Router.get("/dashboard", checkToken, paymentsControllers.getDashboardOrder);

module.exports = Router;
