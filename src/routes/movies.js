const Router = require("express").Router();
const {
  createMovies,
  readMovies,
  readMoviesUpcoming,
  readMoviesDetail,
  readMoviesNowshow,
  readCinemas,
} = require("../controllers/movies");
// check token
const { checkToken } = require("../middlewares/auth");
// multer
const imageUpload = require("../middlewares/upload");
// validasi input
const { moviesInput } = require("../middlewares/movies");


// endpoint

Router.post("/", checkToken, imageUpload.single("img"), createMovies);
Router.get("/", readMovies);
Router.get("/upcoming", readMoviesUpcoming);
Router.get("/nowshow", readMoviesNowshow);
Router.get("/cinemas/:location", readCinemas);
Router.get("/:id", readMoviesDetail);

module.exports = Router;
