const { DataTypes } = require('sequelize');
const { bdmysql } = require('../database/MariaDbConnection');

const TipoCiudad = bdmysql.define('Tipo_ciudad', {
    id_tipo_ciudad: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre_tipo_ciudad: {
        type: DataTypes.STRING(45),
        allowNull: false,
    }
}, {
    freezeTableName: true,
    timestamps: false,
});

module.exports = TipoCiudad;
