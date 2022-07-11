const midtransClient = require("midtrans-client");
// Create Snap API instance
let snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

const createPayment = async (paymentType, transaction) => {
  const parameter = {
    paymentType: {
      bank_transfer,
    },
    transaction_details: {
      order_id: transaction.order_id,
      gross_amount: transaction.gross_amount,
    },
  };
  try {
    const result = await snap.createTransaction(parameter);
    // snap.transaction()
    return {
      url: result.redirect_url,
    };
  } catch (error) {
    console.log(error);
  }
};

module.exports = { createPayment, snap };
