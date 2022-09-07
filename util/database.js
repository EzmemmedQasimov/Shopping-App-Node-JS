const mysql = require("mysql2");
const pool = mysql.createPool({
  host: "localhost",
  user: "ezmemmed",
  database: "node_shop_db",
  password: "123456",
});

module.exports = pool.promise();
