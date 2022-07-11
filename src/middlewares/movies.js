const { isError } = require("../helper/response");

const moviesInput = (req, res, next) => {
    const { name, category, release_date, duration, cast, synopsis, time, price, director, show_date, cinemas_id} = req.body;
    const img = req.file;
    if (!category) {
      return isError(res, 400, { msg: "Input category!" });
    }
    if (!name) {
      return isError(res, 400, { msg: "Input name!" });
    }
    if (!release_date) {
      return isError(res, 400, { msg: "Input release date!" });
    }
    if (!duration) {
      return isError(res, 400, { msg: "Input duration!" });
    }
    if (!cast) {
      return isError(res, 400, { msg: "Input cast!" });
    }
    if (!synopsis) {
      return isError(res, 400, { msg: "Input synopsis!" });
    }
    if (!img) {
      return isError(res, 400, { msg: "Input image!" });
    }
    // if (!location) {
    //   return isError(res, 400, { msg: "Input location!" });
    // }
    if (!time) {
      return isError(res, 400, { msg: "Input time!" });
    }
    if (!price) {
      return isError(res, 400, { msg: "Input price!" });
    }
    if (!director) {
      return isError(res, 400, { msg: "Input director!" });
    }
    if (!show_date) {
      return isError(res, 400, { msg: "Input show date!" });
    }
    if (!cinemas_id) {
      return isError(res, 400, { msg: "Input cinemas!" });
    }
  
    next();
  };

module.exports = { moviesInput }