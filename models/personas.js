const { DataTypes } = require('sequelize');
// const { bdmysql } = require('../database/MySqlConnection');
const { bdmysql } = require('../database/MariaDbConnection');

const Personas = bdmysql.define('persona',
    {
        // Model attributes are defined here
        'id_persona': {
            type: DataTypes.INTEGER,
            //allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },


        'nombres': {
            type: DataTypes.STRING,
            allowNull: false
            // allowNull defaults to true
        },
        'apellidos': {
            type: DataTypes.STRING,
            allowNull: false
            // allowNull defaults to true
        },
        'fecha_nacimiento': {
            type: DataTypes.DATE
            // allowNull defaults to true
        },
    },


    {
        //Maintain table name don't plurilize
        freezeTableName: true,


        // I don't want createdAt
        createdAt: false,


        // I don't want updatedAt
        updatedAt: false
    }
);


module.exports = {
    Personas
}
