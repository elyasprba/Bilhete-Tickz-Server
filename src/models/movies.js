const db = require("../config/db");
const { v4: uuidV4 } = require("uuid");
const InvariantError = require("../exceptions/InvariantError");
const NotfoundError = require("../exceptions/NotfoundError");

const getCinemas = async (location) => {
  try {
    const sqlQuery = "SELECT * from cinemas WHERE location = $1";
    const result = await db.query(sqlQuery, [location]);
    return result.rows;
  } catch (error) {
    throw error;
  }
};
const postMovies = async (body, img) => {
  try {
    const id = uuidV4();
    const created_at = new Date().toISOString();
    const updated_at = created_at;
    const { name, category, release_date, duration, cast, synopsis, director } =
      body;
    const sqlQuery =
      "insert into movies values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) returning id";
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
      director,
    ]);

    if (!result.rows.length) {
      throw new InvariantError("failed to add movies");
    }
    return result.rows[0].id;
  } catch (error) {
    throw error;
  }
};

const getMovies = async (query, upcoming = false, nowshow = false) => {
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
    if (byName !== undefined && query.name !== "") {
      queryArray.push("name");
      queryList.push({ query: "name", value: query.name });
      queryKey.push(query.name);
    }
    if (byMonth !== undefined && query.month !== "") {
      queryList.push({ query: "month", value: query.month });
    }

    //  loop pengecekan filter yang ada
    let countFilter = 0;
    let textQuery = "";
    queryArray.map((item) => {
      countFilter += 1;
      if (queryArray.length === 1) {
        textQuery += `${
          upcoming === true ? " AND" : ""
        } lower(${item}) LIKE lower('%' || $${countFilter} || '%') `;
        return;
      }
      textQuery += ` AND lower(${item}) LIKE lower('%' || $${countFilter} || '%') `;
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
    const nowDate = `${date.getMonth()}/${
      date.getDate() + 1
    }/${date.getFullYear()}`;
    const sqlQuery = "select id,name,category,img,release_date from movies ";
    const sqlCek = `${
      upcoming === true ? "WHERE release_date > '" + nowDate + "'" : ""
    } ${nowshow === true ? "WHERE release_date <= '" + nowDate + "'" : ""}
    ${upcoming === false && nowshow === false ? "WHERE " : ""}
    ${textQuery} `;

    // pagination
    const { page = 1, limit = 12 } = query;
    let limitValue = limit;
    const offset = parseInt(page - 1) * parseInt(limit);
    const paginationSql = ` LIMIT $${queryKey.length + 1} OFFSET $${
      queryKey.length + 2
    }`;

    //  total data dan total page
    const dataQuery =
      queryArray.length > 0 || upcoming === true || nowshow === true
        ? sqlCek
        : "";
    const queryCountData =
      "select id,name,category,img,release_date from movies " +
      dataQuery +
      querySort;
    let countData;
    countData = await db.query(
      queryCountData,
      queryKey.length !== 0 ? queryKey : ""
    );

    if (byMonth === undefined || query.month === "") {
      queryKey.push(limitValue);
      queryKey.push(offset);
    }

    let data;
    if (byMonth !== undefined && upcoming === true && query.month !== "") {
      const fixQuery = sqlQuery + dataQuery + querySort;
      data = await db.query(fixQuery, queryKey.length !== 0 ? queryKey : "");
      let dataFilter = [];
      // data count
      // data rows
      // month index
      const arrMonth = [
        "january",
        "february",
        "march",
        "april",
        "may",
        "june",
        "july",
        "august",
        "september",
        "october",
        "november",
        "december",
      ];

      const value = query.month;
      const monthNow = arrMonth.indexOf(value) + 1;
      data.rows.map((item) => {
        const month = item.release_date.getMonth() + 1;
        if (monthNow === month) {
          dataFilter.push(item);
        }
      });
      countData = dataFilter.length;
      data = dataFilter.slice(offset, offset + limitValue);
    } else {
      const fixQuery = sqlQuery + dataQuery + querySort + paginationSql;

      data = await db.query(fixQuery, queryKey.length !== 0 ? queryKey : "");
    }

    // atur meta
    const totalData =
      byMonth !== undefined && upcoming === true && query.month !== ""
        ? countData
        : countData.rowCount;
    const totalPage = Math.ceil(totalData / parseInt(limitValue));

    return {
      data:
        byMonth !== undefined && upcoming === true && query.month !== ""
          ? data
          : data.rows,
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

const postShowtime = async (price, movies_id, time, cinemas_id, show_date) => {
  try {
    const id = uuidV4();
    const created_at = new Date().toISOString();
    const updated_at = created_at;
    const status = "show soon";
    const sqlQuery =
      "insert into showtimes values($1,$2,$3,$4,$5,$6,$7,$8,$9) returning id";
    const result = await db.query(sqlQuery, [
      id,
      movies_id,
      cinemas_id,
      time,
      status,
      price,
      created_at,
      updated_at,
      show_date,
    ]);

    if (!result.rows.length) {
      throw new InvariantError("failed to add movies");
    }
    return result.rows[0].id;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  postMovies,
  postShowtime,
  getMovies,
  getMoviesById,
  getCinemas,
};
