// const { body } = require("express-validator");
// import { nanoid } from 'https://cdn.jsdelivr.net/npm/nanoid/nanoid.js'
const { v4: uuidV4 } = require("uuid");
const db = require("../config/db");

const register = (email, hashedPassword) => {
  return new Promise((resolve, reject) => {
    const id = uuidV4();
    const created_at = new Date(Date.now());
    const sqlQuery =
      "INSERT INTO users (id, email, password, created_at) VALUES ($1, $2, $3, $4) returning *";
    const values = [id, email, hashedPassword, created_at];
    db.query(sqlQuery, values)
      .then((result) => {
        resolve({ data: result.rows[0] });
      })
      .catch((err) => {
        reject({ status: 500, err });
      });
  });
};

const getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    const sqlQuery = "SELECT * FROM users WHERE email = $1";
    db.query(sqlQuery, [email])
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject({ status: 500, err });
      });
  });
};

const getPassByUserEmail = async (email) => {
  try {
    const sqlQuery = "SELECT * FROM users WHERE email = $1";
    const result = await db.query(sqlQuery, [email]);
    // cek apakah ada pass
    if (result.rowCount === 0)
      throw { status: 400, err: { msg: "Email is not registered" } };
    return result.rows[0];
  } catch (error) {
    const { status = 500, err } = error;
    throw { status, err };
  }
};

const verifyEmail = async (email) => {
  try {
    let sqlQuery =
      "UPDATE users SET status='active' WHERE email=$1 RETURNING *";
    const result = await db.query(sqlQuery, [email]);
    if (!result.rowCount)
      throw new ErrorHandler({ status: 404, message: "User Not Found" });
    return {
      data: result.rows[0],
    };
  } catch (err) {
    throw new ErrorHandler({
      status: err.status ? err.status : 500,
      message: err.message,
    });
  }
};

module.exports = { register, getUserByEmail, getPassByUserEmail, verifyEmail };
