const db = require("../config/db");
const InvariantError = require("../exceptions/InvariantError");
const NotfoundError = require("../exceptions/NotfoundError");

const getCinemas = async (id) => {
  try {
    const result = await db.query(
      "select c.*,s.price ,s.show_date  from cinemas c inner join showtimes s on c.id = s.cinemas_id where s.movies_id = $1 group by c.id ,s.show_date,s.price  ",
      [id]
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
};
const getShowtimes = async (cinemas_id, movies_id) => {
  try {
    const result = await db.query(
      "select id,time from showtimes where movies_id = $1 and cinemas_id = $2",
      [movies_id, cinemas_id]
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
};

module.exports = { getCinemas, getShowtimes };
