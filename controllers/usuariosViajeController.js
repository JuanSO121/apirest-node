const { request, response } = require('express');
const UsuariosViaje = require('../models/usuariosViaje');

// Obtener todas las relaciones usuarios-viaje
const getUsuariosViajes = async (req = request, res = response) => {
    try {
        const usuariosViajes = await UsuariosViaje.findAll();
        res.json({
            ok: true,
            data: usuariosViajes
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error al obtener las relaciones usuarios-viaje',
            error: error.message
        });
    }
};

// Obtener una relación usuario-viaje por IDs
const getUsuariosViajeById = async (req = request, res = response) => {
    const { Usuario_id_usuario, Viaje_id_viaje } = req.params;
    try {
        const usuariosViaje = await UsuariosViaje.findOne({
            where: {
                Usuario_id_usuario,
                Viaje_id_viaje
            }
        });
        if (!usuariosViaje) {
            return res.status(404).json({
                ok: false,
                msg: `No se encontró la relación con Usuario_id_usuario ${Usuario_id_usuario} y Viaje_id_viaje ${Viaje_id_viaje}`,
            });
        }
        res.json({
            ok: true,
            data: usuariosViaje
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error al obtener la relación usuario-viaje',
            error: error.message
        });
    }
};

// Crear una nueva relación usuario-viaje
const createUsuariosViaje = async (req = request, res = response) => {
    const { Usuario_id_usuario, Viaje_id_viaje, Rol } = req.body;
    try {
        const nuevoUsuariosViaje = await UsuariosViaje.create({ Usuario_id_usuario, Viaje_id_viaje, Rol });
        res.status(201).json({
            ok: true,
            data: nuevoUsuariosViaje
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error al crear la relación usuario-viaje',
            error: error.message
        });
    }
};

// Eliminar una relación usuario-viaje
const deleteUsuariosViaje = async (req = request, res = response) => {
    const { Usuario_id_usuario, Viaje_id_viaje } = req.params;
    try {
        const usuariosViaje = await UsuariosViaje.findOne({
            where: {
                Usuario_id_usuario,
                Viaje_id_viaje
            }
        });
        if (!usuariosViaje) {
            return res.status(404).json({
                ok: false,
                msg: `No se encontró la relación con Usuario_id_usuario ${Usuario_id_usuario} y Viaje_id_viaje ${Viaje_id_viaje}`,
            });
        }
        await usuariosViaje.destroy();
        res.json({
            ok: true,
            msg: 'Relación usuario-viaje eliminada con éxito'
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error al eliminar la relación usuario-viaje',
            error: error.message
        });
    }
};

module.exports = {
    getUsuariosViajes,
    getUsuariosViajeById,
    createUsuariosViaje,
    deleteUsuariosViaje
};
