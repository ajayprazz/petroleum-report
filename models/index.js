const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database/petroleums.db",
  logging: false,
});

let db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Petroleum = require("./petroleums")(sequelize, Sequelize);

db.sequelize.sync();

module.exports = db;
