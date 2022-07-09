const jwt = require("jsonwebtoken");
const { isError } = require("../helper/response");
const { getUserByEmail } = require("../models/auth");
const { client } = require("../config/redis.js");

const registerInput = (req, res, next) => {
  // cek apakah Undifined body sesuai dengan yang diinginkan
  const { email, password } = req.body;
  let emailFormat = /^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/;
  if (!email) {
    return isError(res, 400, { msg: "Email cannot be empty!" });
  }
  for (const key in req.body) {
    if (key === "email") {
      if (!req.body[key].match(emailFormat)) {
        return isError(res, 400, {
          msg: "Please insert a valid email!",
        });
      }
    }
  }

  if (!password) {
    return isError(res, 400, { msg: "Password cannot be empty!" });
  }

  next();
};

const loginInput = (req, res, next) => {
  // cek apakah Undifined body sesuai dengan yang diinginkan
  const { email, password } = req.body;
  let emailFormat = /^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/;
  if (!email) {
    return isError(res, 400, {
      msg: "Email cannot be empty!",
    });
  }
  
  for (const key in req.body) {
    if (key === "email") {
      if (!req.body[key].match(emailFormat)) {
        return isError(res, 400, {
          msg: "Please insert a valid email!",
        });
      }
    }
  }
  if (!password) {
    return isError(res, 400, { msg: "Password cannot be empty!" });
  }

  next();
};

const forgotInput = (req, res, next) => {
  const { email } = req.params;
  let emailFormat = /^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/;
  if (!email) {
    return isError(res, 400, {
      msg: "Email cannot be empty!",
    });
  }
  
  for (const key in req.params) {
    if (key === "email") {
      if (!req.params[key].match(emailFormat)) {
        return isError(res, 400, {
          msg: "Please insert a valid email!",
        });
      }
    }
  }

  next();
};

const checkDuplicate = (req, res, next) => {
  getUserByEmail(req.body.email)
    .then((result) => {
      if (result.rowCount > 0)
        return isError(res, 400, { msg: "Email already use!" });
      next();
    })
    .catch((error) => {
      const { status, err } = error;
      isError(res, status, err);
    });
};

const checkToken = (req, res, next) => {
  const bearerToken = req.header("Authorization");
  // bearer token
  if (!bearerToken) {
    return isError(res, 401, { msg: "Sign in needed" });
  }
  const token = bearerToken.split(" ")[1];
  // verifikasi token
  jwt.verify(
    token,
    process.env.JWT_SECRET,
    { issuer: process.env.JWT_ISSUER },
    (err, payload) => {
      // error handling
      if (err && err.name === "TokenExpiredError"){
        return isError(res, 401, { msg: "You need to Sign in again" });
      }
      console.log(err);
      const { id, email, username, phone, date, address, gender, pictures, auth } = payload;
      req.userPayload = { id, email, username, phone, date, address, gender, pictures, auth };
      next();
    }
  );
};

const emailToken = (req, _res, next) => {
  const { token } = req.params;
  jwt.verify(
    token,
    process.env.JWT_SECRET_CONFIRM_KEY,
    async (err, payload) => {
      if (err) {
        next({
          status: 403,
          message: "Your link expired, please register again.",
        });
        return;
      }
      try {
        const cachedToken = await client.get(`jwt${payload.email}`);
        if (!cachedToken) {
          throw new ErrorHandler({
            status: 403,
            message: "Your link expired,please register again",
          });
        }

        if (cachedToken !== token) {
          throw new ErrorHandler({
            status: 403,
            message: "Token Unauthorize, please register again",
          });
        }
      } catch (error) {
        console.log(error)
        const status = error.status ? error.status : 500;
        next({ status, message: error.message });
      }
      req.userPayload = payload;
      next();
    }
  );
};

module.exports = { checkDuplicate, checkToken, loginInput, registerInput, emailToken, forgotInput };