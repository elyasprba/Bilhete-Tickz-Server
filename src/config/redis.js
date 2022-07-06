const redis = require("redis");

const client = redis.createClient({
  url: process.env.HEROKU_REDIS_URL,
});

const redisConn = async () => {
  try {
    client.on("error", (err) => console.log(err));
    await client.connect();
    console.log("redis connected");
  } catch (err) {
    console.log(err);
  }
};

module.exports = { redisConn, client };
