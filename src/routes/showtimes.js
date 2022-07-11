const Router = require("express").Router();
const { readShowtimes, getShowtimesDetail } = require("../controllers/showtimes");
const { checkToken } = require("../middlewares/auth");

// endpoint
Router.get("/:id", readShowtimes);
Router.get("/detail/:id", checkToken, getShowtimesDetail);

module.exports = Router;
