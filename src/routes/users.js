const Router = require("express").Router();

const userController = require("../controllers/users");
const { checkToken } = require("../middlewares/auth");
const imageUpload = require("../middlewares/upload");

//Router User
Router.get("/", checkToken, userController.getUserInfo);
Router.patch("/", checkToken, imageUpload.single("pictures"), userController.patchUserInfo);
Router.patch("/edit-password", userController.patchUserPassword);

module.exports = Router;
