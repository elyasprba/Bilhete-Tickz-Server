const db = require("../config/db");
//const { param } = require("../routes/transactions");
const { ErrorHandler } = require("../helper/errorHandler");
const { v4: uuidV4 } = require("uuid");
const { snap } = require("../config/midtrans");

const createNewPayments = async (body, id) => {
  const {
    seat,
    price,
    users_id,
    quantity,
    total,
    showtimes_id,
    payment_method,
  } = body;
  try {
    const idTickz = uuidV4();
    let userId = id;
    let orderId;
    let params = [];
    let queryParams = [];
    let status = false;
    let orderItemQuery = [];

    const created_at = new Date().toISOString();
    const updated_at = created_at;
    if (!id) userId = users_id;
    let queryOrderParams = [
      idTickz,
      userId,
      quantity,
      total,
      created_at,
      updated_at,
      seat,
      "unpaid",
      showtimes_id,
      payment_method,
    ];

    let queryOrder =
      "INSERT INTO payments(id, users_id, quantity, total, created_at, updated_at, seat, status, showtimes_id,payment_method) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)  RETURNING id";

    // if (promo_id) {
    //   queryOrder = "with t as (INSERT INTO transactions(users_id, sub_total, shipping, total_price, created_at,promo_id) VALUES($1,$2,$3,$4,$5,$6) returning id),pr as (UPDATE promos set on_delete=true where id = $6) select t.id from t";
    //   queryOrderParams.push(promo_id);
    // }

    const order = await db.query(queryOrder, queryOrderParams);
    orderId = order.rows[0].id;

    // if (status === true) {
    //   orderItemQuery =
    //     "INSERT INTO tickets (id, showtimes_id, seat, price) VALUES ($1, $2, $3, $4)";
    // }

    // // let orderItemQuery = "INSERT INTO tickets(id, showtimes_id, seat, price) VALUES";

    // // product.map((val) => {
    // //   queryParams.push(`($${params.length + 1},$${params.length + 2},$${params.length + 3})`, ",");
    // //   params.push(orderId, val.quantity, val.id);
    // // });

    // params.push(orderId, showtimes_id, seat, price);
    // queryParams.pop();
    // orderItemQuery += queryParams.join("");
    // // orderItemQuery += " RETURNING *";

    // const result = await db.query(orderItemQuery, params);

    return {
      data: orderId,
      message: "Transaction Successfully Created",
    };
  } catch (err) {
    throw new ErrorHandler({
      status: err.status ? err.status : 500,
      message: err.message,
    });
  }
};

const unpaidPayment = async (id) => {
  try {
    const sqlQuery =
      "select * from payments where users_id = $1 and status = 'unpaid' ";
    const result = await db.query(sqlQuery, [id]);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};
const cancelPayment = async (id) => {
  try {
    const sqlQuery =
      "delete from payments where users_id = $1 and status = 'unpaid' returning id";
    const result = await db.query(sqlQuery, [id]);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

const confirmPayment = async (id) => {
  try {
    // const {url } = response;
    // const statusResponse = await snap.transaction.notification(url);
    // let orderId = statusResponse.order_id;
    // let transactionStatus = statusResponse.transaction_status;
    // let fraudStatus = statusResponse.fraud_status;

    // // Sample paymentStatus handling logic

    // if (transactionStatus == "capture") {
    //   // capture only applies to card transaction, which you need to check for the fraudStatus
    //   if (fraudStatus == "challenge") {
    //     // DO set transaction status on your databaase to 'challenge'
    //   } else if (fraudStatus == "accept") {
    //     const result = await db.query(
    //       "UPDATE payments set status = true WHERE id = $1 RETURNING *",
    //       [orderId]
    //     );
    //     return {
    //       data: result.rows[0],
    //     };
    //   }
    // } else if (transactionStatus == "settlement") {
    //   const result = await db.query(
    //     "INSERT INTO tickets (id, showtimes_id, seat, price) VALUES ($1, $2, $3, $4)",
    //     [orderId]
    //   );
    //   return {
    //     data: result.rows[0],
    //   };
    // } else if (transactionStatus == "deny") {
    //   // DO you can ignore 'deny', because most of the time it allows payment retries
    //   // and later can become success
    // } else if (transactionStatus == "cancel" || transactionStatus == "expire") {
    //   // DO set transaction status on your databaase to 'failure'
    // } else if (transactionStatus == "pending") {
    //   // DO set transaction status on your databaase to 'pending' / waiting payment
    // }

    // no midtrans
    const result = await db.query(
      "UPDATE payments set status = 'paid' WHERE id = $1 RETURNING seat,showtimes_id",
      [id]
    );
    return result.rows[0];
  } catch (error) {
    console.log(error);
    const status = error.status || 500;
    throw new ErrorHandler({ status, message: error.message });
  }
};

const postTickets = async (showtimes_id, seat) => {
  try {
    const created_at = new Date().toISOString();
    const updated_at = created_at;
    const idTickz = uuidV4();
    const sql =
      "INSERT INTO tickets (id, showtimes_id, seat,updated_at,created_at) VALUES ($1, $2, $3, $4,$5)";
    await db.query(sql, [idTickz, showtimes_id, seat, created_at, updated_at]);
    return;
  } catch (error) {
    throw error;
  }
};

const getTransactionDetailTickets = (req) => {
  return new Promise((resolve, reject) => {
    const { id } = req.params
    const sqlQuery =
      "select payments.total, payments.seat, payments.quantity, movies.name, showtimes.show_date, showtimes.time, movies.category from payments join users on payments.users_id = users.id join showtimes on payments.showtimes_id = showtimes.id join movies on showtimes.movies_id = movies.id where payments.id = $1 and payments.status = 'paid'";
    db.query(sqlQuery, [id])
      .then((result) => {
        // console.log(result)
        const response = {
          total: result.rowCount,
          data: result.rows,
        };
        // console.log(response)
        resolve(response);
      })
      .catch((err) => {
        reject({ status: 500, err });
      });
  });
};

const getHistoryTransactionUsers = (id) => {
  return new Promise((resolve, reject) => {
    const sqlQuery =
      "select payments.id, payments.status, payments.total, payments.seat, payments.quantity, movies.name, showtimes.show_date, showtimes.time, movies.category, cinemas.name as name_cinemas from payments join users on payments.users_id = users.id join showtimes on payments.showtimes_id = showtimes.id join cinemas on showtimes.cinemas_id = cinemas.id join movies on showtimes.movies_id = movies.id where users.id = $1";
    db.query(sqlQuery, [id])
      .then((result) => {
        //console.log(result)
        const response = {
          total: result.rowCount,
          data: result.rows,
        };
        resolve(response);
      })
      .catch((err) => {
        reject({ status: 500, err });
      });
  });
};

const getDashboard = (query) => {
  return new Promise((resolve, reject) => {
    const { created_at } = query
    const sqlQuery =
      "select payments.created_at, sum(payments.total) as revenue, movies.name from payments join showtimes on payments.showtimes_id = showtimes.id join movies on showtimes.movies_id = movies.id where payments.created_at > now() - interval '1 $1' group by movies.name, payments.id order by movies.name asc";
    db.query(sqlQuery, [created_at])
      .then((result) => {
        const response = {
          total: result.rowCount,
          data: result.rows,
        };
        // console.log(response)
        resolve(response);
      })
      .catch((err) => {
        reject({ status: 500, err });
      });
  });
};

module.exports = {
  createNewPayments,
  confirmPayment,
  unpaidPayment,
  postTickets,
  getTransactionDetailTickets,
  getHistoryTransactionUsers,
  cancelPayment,
  getDashboard
};