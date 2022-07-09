const db = require("../config/db");
const InvariantError = require("../exceptions/InvariantError");
const NotfoundError = require("../exceptions/NotfoundError");

const getCinemas = async (query, id) => {
  try {
    const byDate = Object.keys(query).find((item) => item === "date");
    const byLocation = Object.keys(query).find((item) => item === "location");
    const bySort = Object.keys(query).find((item) => item === "sort");
    const byOrder = Object.keys(query).find((item) => item === "order");
    //  array query
    let queryArray = [];
    let querySort = "";
    let queryKey = [];
    let queryList = [];

    //  handler filter
    if (byLocation !== undefined && query.location !== "") {
      queryArray.push("c.location");
      queryList.push({ query: "location", value: query.location });
      queryKey.push(query.location);
    }
    if (byDate !== undefined && query.date !== "") {
      queryArray.push("s.show_date");
      queryList.push({ query: "date", value: query.date });
      queryKey.push(query.date);
    }

    //  loop pengecekan filter yang ada
    let countFilter = 0;
    let textQuery = "";
    queryArray.map((item) => {
      countFilter += 1;
      textQuery += ` lower(${item}) LIKE lower('%' || $${countFilter} || '%') AND`;
    });
    queryArray.push(id);

    //  handler sort
    if (bySort !== undefined) {
      if (query.sort === "date") {
        querySort = "ORDER BY s.show_date ";
        querySort += byOrder === undefined ? "asc" : query.order;
      }

      queryList.push({ query: "sort", value: query.sort });
      if (query.order !== undefined) {
        queryList.push({ query: "order", value: query.order });
      }
    }
    const sqlQuery =
      "select c.*,s.price ,s.show_date  from cinemas c inner join showtimes s on c.id = s.cinemas_id ";
    const sqlCek = `where ${textQuery} s.movies_id = $${
      queryArray.length - 1
    } group by c.id ,s.show_date,s.price `;

    // pagination
    const { page = 1, limit = 12 } = query;
    let limitValue = limit;
    const offset = parseInt(page - 1) * parseInt(limit);
    const paginationSql = ` LIMIT $${queryKey.length + 1} OFFSET $${
      queryKey.length + 2
    }`;

    //  total data dan total page

    const queryCountData =
      "select id,name,category,img,release_date from movies " +
      sqlCek +
      querySort;
    let countData;
    countData = await db.query(
      queryCountData,
      queryKey.length !== 0 ? queryKey : ""
    );

    const result = await db.query(
      "select c.*,s.price ,s.show_date  from cinemas c inner join showtimes s on c.id = s.cinemas_id group by c.id ,s.show_date,s.price  ",
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
