const { Sequelize } = require("sequelize");

const connectionString = process.env.DATABASE_CONNECTION_STRING;
const sequelize = new Sequelize(connectionString, {
  dialect: "postgres",
});

module.exports = sequelize;
