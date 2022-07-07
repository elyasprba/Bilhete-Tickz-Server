const db = require("../config/db");
const bcrypt = require("bcrypt");
const { ErrorHandler } = require("../middlewares/errorHandler");
const { password } = require("pg/lib/defaults");

const getUserbyId = (id) => {
  return new Promise((resolve, reject) => {
    const sqlQuery = "SELECT * from users WHERE id = $1";
    db.query(sqlQuery, [id])
      .then((data) => {
        if (data.rows.length === 0) {
          return reject({ status: 404, err: "User Not Found" });
        }
        const response = {
          data: data.rows,
        };
        resolve(response);
      })
      .catch((err) => {
        reject({ status: 500, err });
      });
  });
};

// const updateUser = (id, body, file) => {
//   return new Promise((resolve, reject) => {
//     const { email, password, firstname, lastname, point, phone_number, } = body;
//     const hashedPassword = bcrypt.hash(password, 10);
//     console.log(hashedPassword)
//     const updated_at = new Date(Date.now());
//     const pictures = file ? file.path : null;
//     const sqlQuery =
//       "UPDATE users SET email= COALESCE($1, email), password= COALESCE($2, password), firstname= COALESCE($3, firstname), lastname= COALESCE($4, lastname), point= COALESCE($5, point), pictures= COALESCE(NULLIF($6, ''), pictures), phone_number= COALESCE($7, phone_number),  updated_at = $8 WHERE id=$9 RETURNING *";
//     db.query(sqlQuery, [email, firstname, lastname, point, pictures, phone_number, hashedPassword, updated_at, id])
//       .then((data) => {
//         const response = {
//           data: data.rows,
//           msg: "Your data has been updated!",
//         };
//         resolve(response);
//       })
//       .catch((err) => {
//         reject({ status: 500, err });
//       });
//   });
// };

const updateUser = async (id, body, file) => {
  try {
    const { email, password, firstname, lastname, point, phone_number, } = body;
    const updated_at = await new Date(Date.now());
    const pictures = await file ? file.path : null;
    const hashedNewPassword = await bcrypt.hash(password, 10);
    const resetPass = await db.query("UPDATE users SET email= COALESCE($1, email), password= COALESCE($2, password), firstname= COALESCE($3, firstname), lastname= COALESCE($4, lastname), point= COALESCE($5, point), pictures= COALESCE(NULLIF($6, ''), pictures), phone_number= COALESCE($7, phone_number),  updated_at = $8 WHERE id=$9 RETURNING *", [email, hashedNewPassword, firstname, lastname, point, pictures, phone_number, updated_at, id]);
    if (!resetPass.rowCount) throw new ErrorHandler({ status: 404, message: "Id Not Found" });
    return {
      message: "Edit success",
    };
  } catch (error) {
    const { status, message } = error;
    throw new ErrorHandler({ status: status ? status : 500, message });
  }
};

const updateUserPassword = async (newPassword, email) => {
  try {
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    const resetPass = await db.query("UPDATE users set password = $1 WHERE email = $2 RETURNING *", [hashedNewPassword, email]);
    if (!resetPass.rowCount) throw new ErrorHandler({ status: 404, message: "Email Not Found" });
    return {
      message: "Your Password successfully recovered",
    };
  } catch (error) {
    const { status, message } = error;
    throw new ErrorHandler({ status: status ? status : 500, message });
  }
};

module.exports = {
  getUserbyId,
  updateUser,
  updateUserPassword
};
