const db = require("../config/db");
//const { param } = require("../routes/transactions");
const { ErrorHandler } = require("../helper/errorHandler");
const { v4: uuidV4 } = require("uuid");
const { snap } = require("../config/midtrans");

const createNewPayments = async (body, id) => {
  const { showtimes_id, seat, price, users_id, quantity, total } = body;
  try {
    const idTickz = uuidV4();
    let userId = id;
    let orderId;
    let params = [];
    let queryParams = [];
    let status = false;
    let orderItemQuery = []

    const created_at = new Date(Date.now());
    if (!id) userId = users_id;
    let queryOrderParams = [idTickz, userId ,quantity, total, created_at];

    let queryOrder = "INSERT INTO payments(id, users_id, quantity, total, created_at) VALUES ($1, $2, $3, $4, $5)  RETURNING id";

    // if (promo_id) {
    //   queryOrder = "with t as (INSERT INTO transactions(users_id, sub_total, shipping, total_price, created_at,promo_id) VALUES($1,$2,$3,$4,$5,$6) returning id),pr as (UPDATE promos set on_delete=true where id = $6) select t.id from t";
    //   queryOrderParams.push(promo_id);
    // }

    const order = await db.query(queryOrder, queryOrderParams);
    orderId = order.rows[0].id;

    if(status === true) {
      orderItemQuery = "INSERT INTO tickets (id, showtimes_id, seat, price) VALUES ($1, $2, $3, $4)";
    }

    // let orderItemQuery = "INSERT INTO tickets(id, showtimes_id, seat, price) VALUES";

    // product.map((val) => {
    //   queryParams.push(`($${params.length + 1},$${params.length + 2},$${params.length + 3})`, ",");
    //   params.push(orderId, val.quantity, val.id);
    // });

    params.push(orderId, showtimes_id, seat, price);
    queryParams.pop();
    orderItemQuery += queryParams.join("");
    // orderItemQuery += " RETURNING *";

    const result = await db.query(orderItemQuery, params);

    return { data: result.rows[0], message: "Transaction Successfully Created" };
  } catch (err) {
    throw new ErrorHandler({ status: err.status ? err.status : 500, message: err.message });
  }
};

const confirmPayment = async (response) => {
  try {
    const { body } = response;
    const statusResponse = await snap.transaction.notification(body);
    let orderId = statusResponse.order_id;
    let transactionStatus = statusResponse.transaction_status;
    let fraudStatus = statusResponse.fraud_status;

    // Sample paymentStatus handling logic

    if (transactionStatus == "capture") {
      // capture only applies to card transaction, which you need to check for the fraudStatus
      if (fraudStatus == "challenge") {
        // DO set transaction status on your databaase to 'challenge'
      } else if (fraudStatus == "accept") {
        const result = await db.query("UPDATE payments set status = true WHERE id = $1 RETURNING *", [orderId]);
        return {
          data: result.rows[0],
        };
      }
    } else if (transactionStatus == "settlement") {
      const result = await db.query("INSERT INTO tickets (id, showtimes_id, seat, price) VALUES ($1, $2, $3, $4)", [orderId]);
      return {
        data: result.rows[0],
      };
    } else if (transactionStatus == "deny") {
      // DO you can ignore 'deny', because most of the time it allows payment retries
      // and later can become success
    } else if (transactionStatus == "cancel" || transactionStatus == "expire") {
      // DO set transaction status on your databaase to 'failure'
    } else if (transactionStatus == "pending") {
      // DO set transaction status on your databaase to 'pending' / waiting payment
    }
  } catch (error) {
    console.log(error)
    const status = error.status || 500;
    throw new ErrorHandler({ status, message: error.message });
  }
};

module.exports = {
    createNewPayments,
    confirmPayment
  }