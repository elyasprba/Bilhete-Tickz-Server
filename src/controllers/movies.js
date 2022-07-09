const InvariantError = require("../exceptions/InvariantError");
const {
  postMovies,
  postShowtime,
  getMovies,
  getMoviesById,
  getCinemas,
} = require("../models/movies");
const response = require("../helper/response");
const ClientError = require("../exceptions/ClientError");
const {
  isSuccessHaveData,
  isSuccessHavePagination,
} = require("../helper/response");
const NotfoundError = require("../exceptions/NotfoundError");

const createMovies = async (req, res) => {
  try {
    const { file = null } = req;
    if (file === null) {
      throw new InvariantError("img must be required");
    }

    const timeArray = JSON.parse(req.body.time);
    const cinemas = JSON.parse(req.body.cinemas_id);

    const id = await postMovies(req.body, file.path);
    const waitPosttime = (cinemas_id) => {
      return new Promise((resolve, reject) => {
        let count = 0;
        timeArray.map(async (time) => {
          try {
            await postShowtime(
              req.body.price,
              id,
              time,
              cinemas_id,
              req.body.show_date
            );
            count += 1;
            if (timeArray.length === count) {
              return resolve();
            }
          } catch (error) {
            reject(error);
          }
        });
      });
    };

    const waitPostcinemas = new Promise((resolve, reject) => {
      let count = 0;
      cinemas.map(async (item) => {
        try {
          await waitPosttime(item.id);
          count += 1;
          if (cinemas.length === count) {
            return resolve();
          }
        } catch (error) {
          reject(error);
        }
      });
    });
    await waitPostcinemas;
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
        : { next: `/movies?${queryPath}page=${nextPage}` };
    let prev =
      req.query.page <= 1
        ? {}
        : { prev: `/movies?${queryPath}page=${prevPage}` };

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
        : { next: `/movies/upcoming?${queryPath}page=${nextPage}` };
    let prev =
      req.query.page <= 1
        ? {}
        : { prev: `/movies/upcoming?${queryPath}page=${prevPage}` };

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
const readMoviesNowshow = async (req, res) => {
  try {
    // cek query page
    req.query.page =
      req.query.page === undefined
        ? 1
        : req.query.page === ""
        ? 1
        : req.query.page;
    const result = await getMovies(req.query, false, true);

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
        : { next: `/movies/nowshow?${queryPath}page=${nextPage}` };
    let prev =
      req.query.page <= 1
        ? {}
        : { prev: `/movies/nowshow?${queryPath}page=${prevPage}` };

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

const readCinemas = async (req, res) => {
  try {
    const location = req.params.location;
    const result = await getCinemas(location);
    isSuccessHaveData(res, 200, result, "read data has been success");
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
  readCinemas,
  readMoviesUpcoming,
  readMoviesDetail,
  readMoviesNowshow,
};
