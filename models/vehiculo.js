const { DataTypes } = require('sequelize');
const { bdmysql } = require('../database/MariaDbConnection');

require('dotenv').config();

const Vehiculo = bdmysql.define('Vehiculo', {
    id_vehiculo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    marca: {
        type: DataTypes.STRING(45),
        allowNull: true,
    },
    color: {
        type: DataTypes.STRING(45),
        allowNull: true,
    },
    modelo: {
        type: DataTypes.STRING(45),
        allowNull: true,
    },
    id_conductor: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Usuario', // Nombre de la tabla referenciada
            key: 'id_usuario',
        },
    },
}, {
    freezeTableName: true,
    timestamps: false,
});

module.exports = Vehiculo;
