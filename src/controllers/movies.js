const InvariantError = require("../exceptions/InvariantError");
const {
  postMovies,
  postShowtime,
  getMovies,
  getMoviesById,
} = require("../models/movies");
const response = require("../helper/response");
const ClientError = require("../exceptions/ClientError");
const {
  isSuccessHaveData,
  isSuccessHavePagination,
} = require("../helper/response");

const createMovies = async (req, res) => {
  try {
    const { file = null } = req;
    if (file === null) {
      throw new InvariantError("img must be required");
    }
    const id = await postMovies(req.body, file.path);

    const timeArray = JSON.parse(req.body.time);

    const waitPost = new Promise((resolve, reject) => {
      let count = 0;
      timeArray.map(async (time) => {
        try {
          await postShowtime(req.body, id, time);
          count += 1;
          if (timeArray.length === count) {
            return resolve();
          }
        } catch (error) {
          reject(error);
        }
      });
    });
    await waitPost;
    response.isSuccessNoData(res, 201, "Create Data has been success");
  } catch (error) {
    if (error instanceof ClientError) {
      return response.isError(res, error.statusCode, error.message);
    }
    //   error server
    console.log(error);
    return response.isError(
      res,
      500,
      "Sorry, there was a failure on our server"
    );
  }
};
const readMovies = async (req, res) => {
  try {
    // cek query page
    req.query.page =
      req.query.page === undefined
        ? 1
        : req.query.page === ""
        ? 1
        : req.query.page;
    const result = await getMovies(req.query);

    //  path
    let queryPath = "";
    result.query.map((item) => {
      queryPath += `${item.query}=${item.value}&`;
    });
    const nextPage = parseInt(req.query.page) + 1;
    const prevPage = parseInt(req.query.page) - 1;

    let next =
      nextPage > result.totalPage
        ? {}
        : { next: `/product?${queryPath}page=${nextPage}` };
    let prev =
      req.query.page <= 1
        ? {}
        : { prev: `/product?${queryPath}page=${prevPage}` };

    //   meta
    const meta = {
      totalData: result.totalData,
      totalPage: result.totalPage,
      page: req.query.page,
      ...next,
      ...prev,
    };

    isSuccessHavePagination(
      res,
      200,
      result.data,
      meta,
      "Read All movies has been success"
    );
  } catch (error) {
    if (error instanceof ClientError) {
      return response.isError(res, error.statusCode, error.message);
    }
    //   error server
    console.log(error);
    return response.isError(
      res,
      500,
      "Sorry, there was a failure on our server"
    );
  }
};
const readMoviesUpcoming = async (req, res) => {
  try {
    // cek query page
    req.query.page =
      req.query.page === undefined
        ? 1
        : req.query.page === ""
        ? 1
        : req.query.page;
    const result = await getMovies(req.query, true);

    //  path
    let queryPath = "";
    result.query.map((item) => {
      queryPath += `${item.query}=${item.value}&`;
    });
    const nextPage = parseInt(req.query.page) + 1;
    const prevPage = parseInt(req.query.page) - 1;

    let next =
      nextPage > result.totalPage
        ? {}
        : { next: `/product?${queryPath}page=${nextPage}` };
    let prev =
      req.query.page <= 1
        ? {}
        : { prev: `/product?${queryPath}page=${prevPage}` };

    //   meta
    const meta = {
      totalData: result.totalData,
      totalPage: result.totalPage,
      page: req.query.page,
      ...next,
      ...prev,
    };

    isSuccessHavePagination(
      res,
      200,
      result.data,
      meta,
      "Read All movies has been success"
    );
  } catch (error) {
    if (error instanceof ClientError) {
      return response.isError(res, error.statusCode, error.message);
    }
    //   error server
    console.log(error);
    return response.isError(
      res,
      500,
      "Sorry, there was a failure on our server"
    );
  }
};
const readMoviesDetail = async (req, res) => {
  try {
    const result = await getMoviesById(req.params.id);
    isSuccessHaveData(res, 200, result);
  } catch (error) {
    if (error instanceof ClientError) {
      return response.isError(res, error.statusCode, error.message);
    }
    //   error server
    console.log(error);
    return response.isError(
      res,
      500,
      "Sorry, there was a failure on our server"
    );
  }
};

module.exports = {
  createMovies,
  readMovies,
  readMoviesUpcoming,
  readMoviesDetail,
};
