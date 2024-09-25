const { Sequelize } = require ('sequelize');

const bdmysql = new Sequelize(
  'test',
  'root',
  '',
  {
    host: 'localhost',
    port: '3306',
    dialect: 'mariadb',
  }
);

module.exports = {
    bdmysql
}