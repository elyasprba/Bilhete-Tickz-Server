const InvariantError = require("../exceptions/InvariantError");
const { getCinemas, getShowtimes } = require("../models/showtimes");
const response = require("../helper/response");
const ClientError = require("../exceptions/ClientError");

const readShowtimes = async (req, res) => {
  try {
    const movies_id = req.params.id;
    const cinemas = await getCinemas(movies_id);
    const waitingShowtime = new Promise((resolve, reject) => {
      let data = [];
      let count = 0;
      cinemas.map(async (item) => {
        try {
          const result = await getShowtimes(item.id, movies_id);
          item.list_time = result;
          data.push(item);
          count += 1;
          if (cinemas.length === count) {
            return resolve(data);
          }
        } catch (error) {
          return reject(error);
        }
      });
    });
    const data = await waitingShowtime;

    return response.isSuccessHaveData(
      res,
      200,
      data,
      "Read All movie showtimes has been success"
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

module.exports = { readShowtimes };
