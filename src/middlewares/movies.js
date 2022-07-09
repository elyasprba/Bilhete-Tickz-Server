const { isError } = require("../helper/response");

const moviesInput = (req, res, next) => {
    const { name, category, release_date, duration, cast, synopsis, location, time, price, director, show_date } = req.body;
    // const { img } = req.file;
    if (!name) {
      return isError(res, 400, { msg: "Undefined name!" });
    }
    if (!category) {
      return isError(res, 400, { msg: "Undefined category!" });
    }
    if (!release_date) {
      return isError(res, 400, { msg: "Undefined release date!" });
    }
    if (!duration) {
      return isError(res, 400, { msg: "Undefined duration!" });
    }
    if (!cast) {
      return isError(res, 400, { msg: "Undefined cast!" });
    }
    if (!synopsis) {
      return isError(res, 400, { msg: "Undefined synopsis!" });
    }
    // if (!img) {
    //   return isError(res, 400, { msg: "Undefined image!" });
    // }
    if (!location) {
      return isError(res, 400, { msg: "Undefined location!" });
    }
    if (!time) {
      return isError(res, 400, { msg: "Undefined time!" });
    }
    if (!price) {
      return isError(res, 400, { msg: "Undefined price!" });
    }
    if (!director) {
      return isError(res, 400, { msg: "Undefined director!" });
    }
    if (!show_date) {
      return isError(res, 400, { msg: "Undefined show date!" });
    }
  
    next();
  };

module.exports = { moviesInput }