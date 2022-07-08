const express = require("express");

const Router = express.Router();

const paymentsControllers = require("../controllers/payments");
const { checkToken } = require("../middlewares/auth");

Router.post("/", checkToken, paymentsControllers.postNewTransactions);

module.exports = Router;