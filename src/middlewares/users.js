const { isError } = require("../helper/response");

const editpassInput = (req, res, next) => {
    // cek apakah Undifined body sesuai dengan yang diinginkan
    const { email, newPassword, confirmCode } = req.body;
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
  
    if (!newPassword) {
      return isError(res, 400, { msg: "Password cannot be empty!" });
    }

    if (!confirmCode) {
        return isError(res, 400, { msg: "Confirm code cannot be empty!" });
      }
  
    next();
  };

  module.exports = { editpassInput };