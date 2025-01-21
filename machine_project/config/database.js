const { Sequelize } = require("sequelize");

// Construct the connection string
const connectionString = `postgresql://postgresql_owner:fYWKS0RV5Uzy@ep-shrill-star-a1uno7pu.ap-southeast-1.aws.neon.tech/postgresql?sslmode=require`;

const sequelize = new Sequelize(connectionString, {
  dialect: "postgres",
});

module.exports = sequelize;
