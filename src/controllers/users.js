// const { client } = require("../config/redis");
const { getUserbyId, updateUser } = require("../models/users");

const getUserInfo = (req, res) => {
  getUserbyId(req.userPayload.id)
    .then((result) => {
      const { data } = result;
      res.status(200).json({
        data,
        err: null,
      });
    })
    .catch((error) => {
      const { err, status } = error;
      res.status(status).json({ err, data: [] });
    });
};

// const patchUserInfo = (req, res) => {
//   const { file = null } = req;
//   updateUser(req.userPayload.id, req.body, file)
//     .then((result) => {
//       const { data, msg } = result;
//       res.status(200).json({
//         data,
//         msg,
//       });
//     })
//     .catch((error) => {
//       const { err, status } = error;
//       res.status(status).json({ err, data: [] });
//     });
// };

const patchUserInfo = async (req, res) => {
    try {
      const { file = null } = req;
      const { message } = await updateUser(req.userPayload.id, req.body, file);
      res.status(200).json({
        message,
      });
    } catch (error) {
      const { message, status } = error;
      res.status(status ? status : 500).json({
        error: message,
      });
    }
  };

module.exports = {
  getUserInfo,
  patchUserInfo,
};
