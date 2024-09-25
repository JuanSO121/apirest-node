const { DataTypes } = require('sequelize');
const { bdmysql } = require('../database/MariaDbConnection');
const Vehiculo = require('./vehiculo');

const Viaje = bdmysql.define('Viaje', {
    id_viaje: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    fecha_salida: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    precio: {
        type: DataTypes.STRING(45),
        allowNull: false,
    },
    distancia_ruta: {
        type: DataTypes.STRING(45),
        allowNull: false,
    },
    id_vehiculo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Vehiculo,
            key: 'id_vehiculo',
        },
    },
}, {
    freezeTableName: true,
    timestamps: false,
});

module.exports = Viaje;
