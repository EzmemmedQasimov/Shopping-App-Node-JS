const Sequelize = require("sequelize");
const sequelize = new Sequelize("node_shop_db", "ezmemmed", "123456", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
