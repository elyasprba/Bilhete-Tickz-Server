const Router = require("express").Router();
const {
  createMovies,
  readMovies,
  readMoviesUpcoming,
  readMoviesDetail,
} = require("../controllers/movies");
// check token
const { checkToken } = require("../middlewares/auth");
// multer
const imageUpload = require("../middlewares/upload");

// endpoint

Router.post("/", checkToken, imageUpload.single("img"), createMovies);
Router.get("/", readMovies);
Router.get("/upcoming", readMoviesUpcoming);
Router.get("/:id", readMoviesDetail);

module.exports = Router;
