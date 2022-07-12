const Router = require("express").Router();
const {
  readShowtimes,
  creatShowtimes,
  getShowtimesDetail,
} = require("../controllers/showtimes");
const { checkToken } = require("../middlewares/auth");

// endpoint
Router.post("/", checkToken, creatShowtimes);
Router.get("/:id", readShowtimes);
Router.get("/detail/:id", checkToken, getShowtimesDetail);

module.exports = Router;
