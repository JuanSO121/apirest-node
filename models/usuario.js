const { DataTypes } = require('sequelize');
const { bdmysql } = require('../database/MariaDbConnection');
const { Personas } = require('./personas');
require('dotenv').config();

const Usuarios = bdmysql.define('usuario', {

    id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    contraseña: {
        type: DataTypes.STRING(45),
        allowNull: false
    },

    email: {
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: true
    },

    numero_telefono: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    minibiografia: {
        type: DataTypes.STRING(45),
        allowNull: true
    },

    id_persona: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Personas,
            key: 'id_persona'
        }
    }

}, 
{
    freezeTableName: true,
    timestamps: false
});

module.exports = {
    Usuarios
};
