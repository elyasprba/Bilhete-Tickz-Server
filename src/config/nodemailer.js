const nodemailer = require('nodemailer');

const sendConfirmationEmail = async (name, email, token) => {
   try {
      const transport = nodemailer.createTransport({
         service: 'gmail',
         auth: {
            type: 'OAuth2',
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
            clientId: process.env.OAUTH_CLIENTID,
            clientSecret: process.env.OAUTH_CLIENT_SECRET,
            refreshToken: process.env.OAUTH_REFRESH_TOKEN,
         },
      });
      let mailOptions = {
         from: process.env.MAIL_USERNAME,
         to: email,
         subject: 'Please confirm your Account',
         html: `<h2>Zilgya Furniture Email Confirmation</h2>
      <h3>Hi, ${name}</h3>
      <h3>Thank you for register. Please confirm your email by clicking on the following link :</h3>
      <a href=${process.env.CLIENT_URL}/auth/confirm/${token}> Click here to verify </a>
      </div>`,
      };
      await transport.sendMail(mailOptions);
   } catch (error) {
      console.log(error.message);
   }
};

const sendConfirmationPayment = async (name, email, items, totalPrice, payMethod, token) => {
   try {
      const transport = nodemailer.createTransport({
         service: 'gmail',
         auth: {
            type: 'OAuth2',
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
            clientId: process.env.OAUTH_CLIENTID,
            clientSecret: process.env.OAUTH_CLIENT_SECRET,
            refreshToken: process.env.OAUTH_REFRESH_TOKEN,
         },
      });
      let html = `<h2>Juncoffee Payment Confirmation</h2>
    <h3>Hi, ${name}</h3>
    <h3>Thank you for shopping at Juncoffee. here is your transaction details:</h3>
    ${items.map((val) => {
       return `<ul><h3>${val.name}</h3> 
        <img src=${val.image}/>
        ${val.variant.map((cart) => {
           return `<li>${cart.quantity} pcs</li>
          <li> ${cart.size} </li>
          <li> IDR ${cart.prodPrice}/pcs </li>`;
        })}</ul>`;
    })}
    <h3>Total Price : IDR ${totalPrice} (include tax and shipping) </h3>
    <h3>Please confirm your payment by transfer to the following bank account:</h3>
    <ul>
    <li><h3>BCA</h3></li>
    <li><h3>8720525098</h3></li>
    <li><h3>Juncoffee</h3></li>
  </ul>
  <h2> <a href=${process.env.CLIENT_URL}/auth/payment/${token}> Click here to confirm your payment</a></h2>
    </div>`;
      if (payMethod === 'cash on delivery') {
         html = `<h2>Zilgya Furniture Payment Confirmation</h2>
      <h3>Hi, ${name}</h3>
      <h3>Thank you for shopping at Zilgya Furniture. here is your transaction details:</h3>
      ${items.map((val) => {
         return `<ul><h3>${val.name}</h3> 
        <img src=${val.image}/>
          ${val.variant.map((cart) => {
             return `<li>${cart.quantity} pcs</li>
            <li> ${cart.size} </li>
            <li> IDR ${cart.prodPrice}/pcs </li>`;
          })}</ul>`;
      })}
      <h3>Total Price : IDR ${totalPrice} (include tax and shipping) </h3>
      <h3>Please prepare cash for the delivery</h3>
     <h4> <a href=${process.env.CLIENT_URL}/auth/payment/${token}> Click here to confirm your order</a></h4>
      </div>`;
      }

      let mailOptions = {
         from: process.env.MAIL_USERNAME,
         to: email,
         subject: 'Please confirm your Payment',
         html,
      };

      await transport.sendMail(mailOptions);
   } catch (error) {
      console.log(error.message);
   }
};

const sendPasswordConfirmation = async (name, email, confirmCode) => {
   try {
      const transport = nodemailer.createTransport({
         service: 'gmail',
         auth: {
            type: 'OAuth2',
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
            clientId: process.env.OAUTH_CLIENTID,
            clientSecret: process.env.OAUTH_CLIENT_SECRET,
            refreshToken: process.env.OAUTH_REFRESH_TOKEN,
         },
      });
      let html = `<h2>Zilgya Furniture Forgot Password Confirmation</h2>
    <h3>Hi, ${name}</h3>
    <h3>Here is your account details:</h3>
    <ul>
    <li>Name: <h3>${name}</h3></li>
    <li>Email: <h3>${email}</h3></li>
  </ul>
  YOUR RESET PASSWORD CONFIRMATION CODE: <h1>${confirmCode}</h1> <br>
  INPUT THIS CODE WHEN RESET YOUR PASSWORD !
  <h2> <a href=${process.env.CLIENT_URL}/auth/forgot/${email}> Click here to reset your password</a></h2>
    </div>`;

      let mailOptions = {
         from: process.env.MAIL_USERNAME,
         to: email,
         subject: 'Forgot Password',
         html,
      };

      await transport.sendMail(mailOptions);
   } catch (error) {
      console.log(error.message);
   }
};

module.exports = { sendConfirmationEmail, sendConfirmationPayment, sendPasswordConfirmation };
