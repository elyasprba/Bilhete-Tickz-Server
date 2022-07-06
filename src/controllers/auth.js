const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { register, getPassByUserEmail } = require("../models/auth");
const { isSuccessHaveData, isError } = require("../helper/response");

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
      register( email, hashedPassword, created_at)
        .then(() => {
          isSuccessHaveData(res, 201, { msg: "Register Success" }, null);
        })
        .catch((error) => {
          // console.log(error);
          const { status, err } = error;
          isError(res, status, err);
        });
    })
    .catch((err) => {
      console.log(err)
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
    const result = await bcrypt.compare(password, data.password);
    if (!result)
      return isError(res, 400, { msg: "Email or Password wrong !" });
    // generate jwt
    const payload = {
      id: data.id,
      email,
      auth: data.roles_id,
    };
    const jwtOptions = {
      issuer: process.env.JWT_ISSUER,
      expiresIn: "24h", // expired in 10000s
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, jwtOptions);
    // return
    isSuccessHaveData(res, 200, { email, token, auth: data.roles_id }, null);
  } catch (error) {
    //console.log(error);
    const { status = 500 ,err } = error;
    isError(res, status, err);
  }
};

module.exports = auth;