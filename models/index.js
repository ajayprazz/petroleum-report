const { Sequelize } = require("sequelize");

const env = process.env.NODE_ENV || "production";
const config = require(__dirname + "/../config/config.json")[env];

const sequelize = new Sequelize(config);

let db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Petroleum = require("./petroleums")(sequelize, Sequelize);

db.sequelize.sync();

module.exports = db;
