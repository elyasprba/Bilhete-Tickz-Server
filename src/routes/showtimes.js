const Router = require("express").Router();
const { readShowtimes } = require("../controllers/showtimes");

// endpoint
Router.get("/:id", readShowtimes);

module.exports = Router;
