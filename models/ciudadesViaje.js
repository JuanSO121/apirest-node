const { DataTypes } = require('sequelize');
const { bdmysql } = require('../database/MariaDbConnection');

const CiudadesViaje = bdmysql.define('Ciudades_viaje', {
    id_viaje: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: 'Viaje',
            key: 'id_viaje'
        }
    },
    id_tipo_ciudad: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: 'Tipo_ciudad',
            key: 'id_tipo_ciudad'
        }
    },
    id_ciudad: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: 'Ciudad',
            key: 'id_ciudad'
        }
    }
}, {
    freezeTableName: true,
    timestamps: false,
});

module.exports = CiudadesViaje;
