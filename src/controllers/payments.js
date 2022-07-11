const paymentsModel = require("../models/payments");
const { createPayment } = require("../config/midtrans");
const { createNewPayments, confirmPayment } = paymentsModel;

const postNewTransactions = async (req, res) => {
  try {
    const { id } = req.userPayload;
    const { data, message } = await createNewPayments(req.body, id);
    const { url } = await createPayment(data.orderId, data.total_payment);

    res.status(201).json({
      data,
      id: data.orderId,
      url,
      message,
    });
  } catch (err) {
    const { message, status } = err;
    res.status(status ? status : 500).json({
      error: message,
    });
  }
};

const paymentConfirm = async (req, res) => {
  try {
      const response = createPayment(req.body.payment_type, req.body.transaction_details) 
      const { data } = await confirmPayment(response.url);
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