const paymentsModel = require("../models/payments");
const { createNewPayments, confirmPayment } = paymentsModel;

const postNewTransactions = async (req, res) => {
  try {
    const { id } = req.userPayload;
    const { data, message } = await createNewPayments(req.body, id);

    res.status(201).json({
      data,
      message,
    });
  } catch (err) {
    const { message, status } = err;
    res.status(status ? status : 500).json({
      error: message,
    });
  }
};

const paymentConfirm = async (_req, res) => {
  try {
      const { data } = await confirmPayment(response.body);
      res.status(200).status({
        data,
      });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      error: error.message,
    });
  }
};

module.exports = {
    postNewTransactions,
    paymentConfirm
  };