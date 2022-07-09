const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { register, getPassByUserEmail, verifyEmail } = require("../models/auth");
const { isSuccessHaveData, isError } = require("../helper/response");
const { client } = require("../config/redis.js");
const { sendConfirmationEmail, sendPasswordConfirmation } = require("../config/nodemailer");
const generator = require("generate-password");

const auth = {};

auth.register = (req, res) => {
  // expect sebuah body dengan
  // property email dan pass
  const {
    body: { email, password, created_at },
  } = req;

  bcrypt
    .hash(password, 10)
    .then((hashedPassword) => {
      register(email, hashedPassword, created_at)
        .then(async ({ data }) => {
          const token = jwt.sign({ email: data.email }, process.env.JWT_SECRET_CONFIRM_KEY, { expiresIn: "1h" });
          await client.set(`jwt${data.email}`, token);
          await sendConfirmationEmail(data.email, data.email, token);
          isSuccessHaveData(res, 201, { msg: "Register Success, Please Check email for verification" }, null);
        })
        .catch((error) => {
          console.log(error);
          const { status, err } = error;
          isError(res, status ? status : 500, err);
        });
    })
    .catch((err) => {
      console.log(err);
      isError(res, 500, err);
    });
};

auth.signIn = async (req, res) => {
  try {
    // mendapatkan body email dan pass
    const {
      body: { email, password },
    } = req;
    // cek kecocokan email dan pass di db
    const data = await getPassByUserEmail(email);
    if (data.status !== "active") {
      return isError(res, 403, { msg: "Pending Account. Please Verify Your Email" });
    }
    const result = await bcrypt.compare(password, data.password);
    if (!result) return isError(res, 400, { msg: "Email or Password wrong !" });
    // generate jwt
    const payload = {
      id: data.id,
      email,
      roles: data.roles,
    };

    const jwtOptions = {
      issuer: process.env.JWT_ISSUER,
      expiresIn: "12h", // expired in 12 hours
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, jwtOptions);
    await client.set(`jwt${data.id}`, token);
    // return
    isSuccessHaveData(res, 200, { id: data.id, email, token, roles: data.roles }, null);
  } catch (error) {
    console.log(error)
    const { status = 500, message } = error;
    isError(res, status, { msg: message });
  }
};

auth.logout = async (req, res) => {
  try {
    const cachedLogin = await client.get(`jwt${req.userPayload.id}`);
    if (cachedLogin) {
      await client.del(`jwt${req.userPayload.id}`);
    }
    isSuccessHaveData(res, 200, { message: "You have successfully logged out" }, null);
  } catch (err) {
    isError(res, 500, err.message);
  }
};

auth.confirmEmail = async (req, res) => {
  try {
    const { email } = req.userPayload;
    const data = await verifyEmail(email);

    res.json({
      data,
      message: "Your Email has been verified. Please Login",
    });
  } catch (err) {
    console.log(err)
    const status = err.status ? err.status : 500;
    res.status(status).json({
      error: err.message,
    });
  }
};

auth.forgotPassword = async (req, res) => {
  try {
    const { email } = req.params;
    const confirmCode = generator.generate({
      length: 7,
      numbers: true,
    });

    await sendPasswordConfirmation(email, email, confirmCode);
    await client.set(`forgotpass${email}`, confirmCode);
    res.status(200).json({
      message: "Please check your email for password confirmation",
    });
  } catch (error) {
    const { message, status } = error;
    res.status(status ? status : 500).json({
      error: message,
    });
  }
};

module.exports = auth;
//test