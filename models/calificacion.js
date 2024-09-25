const { DataTypes } = require('sequelize');
const { bdmysql } = require('../database/MariaDbConnection');
const Usuario = require('./usuario');
const Viaje = require('./viaje');

const Calificacion = bdmysql.define('Calificacion', {
    id_calificacion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    puntuacion: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    comentario: {
        type: DataTypes.STRING(45),
        allowNull: true,
    },
    fecha_calificacion: {
        type: DataTypes.STRING(45),
        allowNull: false,
    },
    id_calificador: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Usuario,
            key: 'id_usuario',
        },
    },
    id_calificado: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Usuario,
            key: 'id_usuario',
        },
    },
    id_viaje: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Viaje,
            key: 'id_viaje',
        },
    },
}, {
    freezeTableName: true,
    timestamps: false,
});

module.exports = Calificacion;
