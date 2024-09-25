const { DataTypes } = require('sequelize');
const { bdmysql } = require('../database/MariaDbConnection');

const Ciudad = bdmysql.define('Ciudad', {
    id_ciudad: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING(45),
        allowNull: true,
    },
}, {
    freezeTableName: true,
    timestamps: false,
});

module.exports = Ciudad;
