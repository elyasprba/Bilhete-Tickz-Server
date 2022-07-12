const ClientError = require("../exceptions/ClientError");
const NotfoundError = require("../exceptions/NotfoundError");
const response = require("../helper/response");
const paymentsModel = require("../models/payments");
const {
  createNewPayments,
  cancelPayment,
  confirmPayment,
  unpaidPayment,
  postTickets,
  getTransactionDetailTickets,
  getHistoryTransactionUsers,
  getDashboard
} = paymentsModel;

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

const unpaid = async (req, res) => {
  try {
    const { id } = req.userPayload;
    const result = await unpaidPayment(id);
    if (result !== undefined) {
      return response.isSuccessHaveData(
        res,
        201,
        result,
        "there are unpaid transactions"
      );
    }
    return response.isSuccessHaveData(res, 200, null, "no unpaid transactions");
  } catch (error) {
    if (error instanceof ClientError) {
      return response.isError(res, error.statusCode, error.message);
    }
    //   error server
    console.log(error);
    return response.isError(
      res,
      500,
      "Sorry, there was a failure on our server"
    );
  }
};
const cancelPay = async (req, res) => {
  try {
    const { id } = req.userPayload;
    const result = await cancelPayment(id);
    if (result === undefined) {
      throw new NotfoundError("transaction not found");
    }
    return response.isSuccessNoData(res, 200, "Transaction has been cancel");
  } catch (error) {
    if (error instanceof ClientError) {
      return response.isError(res, error.statusCode, error.message);
    }
    //   error server
    console.log(error);
    return response.isError(
      res,
      500,
      "Sorry, there was a failure on our server"
    );
  }
};

const paymentConfirm = async (req, res) => {
  try {
    const id = req.params.id;
    // const {order_id,groiss_amount} = req.body.transaction_details
    // const response = await createPayment(req.body.payment_type,req.body.transaction_details)
    const result = await confirmPayment(id);
    // create ticket
    let seat = result.seat.split(",");
    const waitTickets = new Promise((resolve, reject) => {
      let count = 0;
      seat.map(async (item) => {
        try {
          await postTickets(result.showtimes_id, item);
          count += 1;
          if (count === seat.length) {
            return resolve();
          }
        } catch (error) {
          return reject(error);
        }
      });
    });

    await waitTickets;
    response.isSuccessNoData(res, 200, "Transaction Paid Successfully");
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      error: error.message,
    });
  }
};

const getTransactionTikects = (req, res) => {
  getTransactionDetailTickets(req)
    .then((data) => {
      res.status(200).json({
        data,
      });
    })
    .catch(({ status, err }) => {
      res.status(status).json({
        err,
      });
    });
};

const getHistoryTransaction = (req, res) => {
  const id = req.userPayload.id;
  getHistoryTransactionUsers(id)
    .then((data) => {
      res.status(200).json({
        data,
      });
    })
    .catch(({ status, err }) => {
      res.status(status).json({
        err,
      });
    });
};

const getDashboardOrder = (req, res) => {
  getDashboard(req.query)
    .then((data) => {
      res.status(200).json({
        data,
      });
    })
    .catch(({ status, err }) => {
      res.status(status).json({
        err,
      });
    });
};

module.exports = {
  cancelPay,
  postNewTransactions,
  paymentConfirm,
  unpaid,
  getTransactionTikects,
  getHistoryTransaction,
  getDashboardOrder
};
