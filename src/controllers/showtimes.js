const InvariantError = require("../exceptions/InvariantError");
const {
  getCinemas,
  getShowtimes,
  getShowtimeDetailFilm,
} = require("../models/showtimes");
const { postShowtime } = require("../models/movies");
const response = require("../helper/response");
const ClientError = require("../exceptions/ClientError");
const NotfoundError = require("../exceptions/NotfoundError");

const creatShowtimes = async (req, res) => {
  try {
    const timeArray = JSON.parse(req.body.time);
    const id = req.body.movie_id;
    const cinemas = JSON.parse(req.body.cinemas_id);
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
          await waitPosttime(item);
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

const readShowtimes = async (req, res) => {
  try {
    // cek query page
    req.query.page =
      req.query.page === undefined
        ? 1
        : req.query.page === ""
        ? 1
        : req.query.page;
    const movies_id = req.params.id;
    const result = await getCinemas(req.query, movies_id);
    if (result.data.length === 0) {
      throw new NotfoundError("data not found");
    }
    const waitingShowtime = new Promise((resolve, reject) => {
      let data = [];
      let count = 0;
      result.data.map(async (item) => {
        try {
          const resultData = await getShowtimes(item.id, movies_id);
          item.list_time = resultData;
          data.push(item);
          count += 1;
          if (result.data.length === count) {
            return resolve(data);
          }
        } catch (error) {
          return reject(error);
        }
      });
    });
    const data = await waitingShowtime;

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
        : { next: `/showtimes/${movies_id}?${queryPath}page=${nextPage}` };
    let prev =
      req.query.page <= 1
        ? {}
        : { prev: `/showtimes/${movies_id}?${queryPath}page=${prevPage}` };

    //   meta
    const meta = {
      totalData: result.totalData,
      totalPage: result.totalPage,
      page: req.query.page,
      ...next,
      ...prev,
    };

    response.isSuccessHavePagination(
      res,
      200,
      data,
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

const getShowtimesDetail = (req, res) => {
  getShowtimeDetailFilm(req.params.id)
    .then((data) => {
      res.status(200).json({
        data,
      });
    })
    .catch((error) => {
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
    });
};

module.exports = { creatShowtimes, readShowtimes, getShowtimesDetail };
