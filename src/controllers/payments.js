const ClientError = require("../exceptions/ClientError");
const response = require("../helper/response");
const paymentsModel = require("../models/payments");
<<<<<<< HEAD
const { createPayment } = require("../config/midtrans");
const { createNewPayments, confirmPayment } = paymentsModel;
=======
const { createNewPayments, confirmPayment, unpaidPayment, postTickets } =
  paymentsModel;
>>>>>>> d9e6b3f31ec405fbf92baa6a088511bac0c043e1

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

module.exports = {
  postNewTransactions,
  paymentConfirm,
  unpaid,
};
