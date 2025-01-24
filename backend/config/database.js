const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  'database_name',
  'postgres',
  'password',
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: false  // Set to true if using SSL
    }
  }
);

module.exports = sequelize;