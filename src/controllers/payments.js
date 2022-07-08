const paymentsModel = require("../models/payments");
const { createNewPayments } = paymentsModel;

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

module.exports = {
    postNewTransactions,
  };