const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { register, getPassByUserEmail } = require('../models/auth');
const { isSuccessHaveData, isError } = require('../helper/response');

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
            .then(() => {
               isSuccessHaveData(res, 201, { msg: 'Register Success' }, null);
            })
            .catch((error) => {
               // console.log(error);
               const { status, err } = error;
               isError(res, status, err);
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
      const result = await bcrypt.compare(password, data.password);
      if (!result) return isError(res, 400, { msg: 'Email or Password wrong !' });
      // generate jwt
      const payload = {
         id: data.id,
         email,
         auth: data.roles_id,
      };
      const jwtOptions = {
         issuer: process.env.JWT_ISSUER,
         expiresIn: '24h', // expired in 10000s
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, jwtOptions);
      // return
      isSuccessHaveData(res, 200, { id: data.id, email, token, roles: data.roles }, null);
   } catch (error) {
      console.log(error);
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
      isSuccessHaveData(res, 200, { message: 'You have successfully logged out' }, null);
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
         message: 'Your Email has been verified. Please Login',
      });
   } catch (err) {
      console.log(err);
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
         message: 'Please check your email for password confirmation',
      });
   } catch (error) {
      //console.log(error);
      const { status = 500, err } = error;
      isError(res, status, err);
   }
};

module.exports = auth;
//test
