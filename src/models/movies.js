const db = require("../config/db");
const { v4: uuidV4 } = require("uuid");
const InvariantError = require("../exceptions/InvariantError");
const NotfoundError = require("../exceptions/NotfoundError");

const postMovies = async (body, img) => {
  try {
    const id = uuidV4();
    const created_at = new Date().toISOString();
    const updated_at = created_at;
    const { name, category, release_date, duration, cast, synopsis } = body;
    const sqlQuery =
      "insert into movies values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) returning id";
    const result = await db.query(sqlQuery, [
      id,
      name,
      category,
      release_date,
      duration,
      cast,
      synopsis,
      created_at,
      updated_at,
      img,
    ]);

    if (!result.rows.length) {
      throw new InvariantError("failed to add movies");
    }
    return result.rows[0].id;
  } catch (error) {
    throw error;
  }
};

const getMovies = async () => {
  try {
    const querySql = "select id,name,category,img from movies";
    const result = await db.query(querySql);
    if (!result.rows.length) {
      throw new InvariantError("failed to get movies");
    }
    return result.rows;
  } catch (error) {
    throw error;
  }
};
const getMoviesById = async (id) => {
  try {
    const querySql = "select * from movies where id = $1";
    const result = await db.query(querySql, [id]);
    if (!result.rows.length) {
      throw new NotfoundError("movie not found");
    }
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

const postShowtime = async (body, movies_id, time) => {
  try {
    const id = uuidV4();
    const created_at = new Date().toISOString();
    const updated_at = created_at;
    const status = "show soon";
    const { cinemas_id, price } = body;
    const sqlQuery =
      "insert into showtimes values($1,$2,$3,$4,$5,$6,$7,$8) returning id";
    const result = await db.query(sqlQuery, [
      id,
      movies_id,
      cinemas_id,
      time,
      status,
      price,
      created_at,
      updated_at,
    ]);

    if (!result.rows.length) {
      throw new InvariantError("failed to add movies");
    }
    return result.rows[0].id;
  } catch (error) {
    throw error;
  }
};

module.exports = { postMovies, postShowtime, getMovies, getMoviesById };
