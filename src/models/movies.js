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

const getMovies = async (query, upcoming = false) => {
  try {
    const byMonth = Object.keys(query).find((item) => item === "month");
    const byName = Object.keys(query).find((item) => item === "name");
    const bySort = Object.keys(query).find((item) => item === "sort");
    const byOrder = Object.keys(query).find((item) => item === "order");

    //  array query
    let queryArray = [];
    let querySort = "";
    let queryKey = [];
    let queryList = [];
    //  handler filter
    if (byName !== undefined) {
      queryArray.push("name");
      queryList.push({ query: "name", value: query.name });
      queryKey.push(query.name);
    }
    if (byMonth !== undefined) {
      queryList.push({ query: "name", value: query.name });
      queryKey.push(query.name);
    }

    //  loop pengecekan filter yang ada
    let countFilter = 0;
    let textQuery = "";
    queryArray.map((item) => {
      countFilter += 1;
      if (queryArray.length === countFilter) {
        textQuery += `lower(${item}) LIKE lower('%' || $${countFilter} || '%') `;
        return;
      }
      textQuery += `lower(${item}) LIKE lower('%' || $${countFilter} || '%') AND `;
    });
    //  handler sort
    if (bySort !== undefined) {
      if (query.sort === "name") {
        querySort = "ORDER BY name ";
        querySort += byOrder === undefined ? "asc" : query.order;
      }

      if (query.sort === "release") {
        querySort = "ORDER BY release_date ";
        querySort += byOrder === undefined ? "asc" : query.order;
      }

      queryList.push({ query: "sort", value: query.sort });
      if (query.order !== undefined) {
        queryList.push({ query: "order", value: query.order });
      }
    }
    const date = new Date();
    const nowDate = `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()}`;
    const sqlQuery = "select id,name,category,img from movies ";
    const sqlCek = `WHERE ${textQuery} ${
      upcoming === true ? "AND release_date > '" + nowDate + "'" : ""
    } `;

    // pagination
    const { page = 1, limit = 12 } = query;
    let limitValue = limit;
    const offset = parseInt(page - 1) * parseInt(limit);
    const paginationSql = ` LIMIT $${queryKey.length + 1} OFFSET $${
      queryKey.length + 2
    }`;

    //  total data dan total page
    const queryCountData =
      "select id,name,category,img from movies " + sqlCek + querySort;
    console.log(queryCountData);
    const countData = await db.query(
      queryCountData,
      queryKey.length !== 0 ? queryKey : ""
    );

    queryKey.push(limitValue);
    queryKey.push(offset);

    const fixQuery = sqlQuery + sqlCek + querySort + paginationSql;
    const data = await db.query(
      fixQuery,
      queryKey.length !== 0 ? queryKey : ""
    );

    // atur meta
    const totalData = countData.rowCount;
    const totalPage = Math.ceil(totalData / parseInt(limitValue));

    return {
      data: data.rows,
      totalData: totalData,
      totalPage: totalPage,
      query: queryList,
    };
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
