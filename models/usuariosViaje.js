const { DataTypes } = require('sequelize');
const { bdmysql } = require('../database/MariaDbConnection');

const UsuariosViaje = bdmysql.define('Usuarios_viaje', {
    Usuario_id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: 'Usuario',
            key: 'id_usuario'
        }
    },
    Viaje_id_viaje: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: 'Viaje',
            key: 'id_viaje'
        }
    },
    Rol: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
            isIn: [['C', 'P']]
        }
    }
}, {
    freezeTableName: true,
    timestamps: false,
});

module.exports = UsuariosViaje;
