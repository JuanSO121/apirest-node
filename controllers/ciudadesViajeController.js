const { request, response } = require('express');
const CiudadesViaje = require('../models/ciudadesViaje');

// Obtener todas las relaciones ciudades-viaje
const getCiudadesViajes = async (req = request, res = response) => {
    try {
        const ciudadesViajes = await CiudadesViaje.findAll();
        res.json({
            ok: true,
            data: ciudadesViajes
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error al obtener las relaciones ciudades-viaje',
            error: error.message
        });
    }
};

// Obtener una relación ciudad-viaje por IDs
const getCiudadesViajeById = async (req = request, res = response) => {
    const { id_viaje, id_tipo_ciudad, id_ciudad } = req.params;
    try {
        const ciudadesViaje = await CiudadesViaje.findOne({
            where: {
                id_viaje,
                id_tipo_ciudad,
                id_ciudad
            }
        });
        if (!ciudadesViaje) {
            return res.status(404).json({
                ok: false,
                msg: `No se encontró la relación con id_viaje ${id_viaje}, id_tipo_ciudad ${id_tipo_ciudad}, id_ciudad ${id_ciudad}`,
            });
        }
        res.json({
            ok: true,
            data: ciudadesViaje
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error al obtener la relación ciudad-viaje',
            error: error.message
        });
    }
};

// Crear una nueva relación ciudad-viaje
const createCiudadesViaje = async (req = request, res = response) => {
    const { id_viaje, id_tipo_ciudad, id_ciudad } = req.body;
    try {
        const nuevaCiudadViaje = await CiudadesViaje.create({ id_viaje, id_tipo_ciudad, id_ciudad });
        res.status(201).json({
            ok: true,
            data: nuevaCiudadViaje
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error al crear la relación ciudad-viaje',
            error: error.message
        });
    }
};

// Eliminar una relación ciudad-viaje
const deleteCiudadesViaje = async (req = request, res = response) => {
    const { id_viaje, id_tipo_ciudad, id_ciudad } = req.params;
    try {
        const ciudadesViaje = await CiudadesViaje.findOne({
            where: {
                id_viaje,
                id_tipo_ciudad,
                id_ciudad
            }
        });
        if (!ciudadesViaje) {
            return res.status(404).json({
                ok: false,
                msg: `No se encontró la relación con id_viaje ${id_viaje}, id_tipo_ciudad ${id_tipo_ciudad}, id_ciudad ${id_ciudad}`,
            });
        }
        await ciudadesViaje.destroy();
        res.json({
            ok: true,
            msg: 'Relación ciudad-viaje eliminada con éxito'
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error al eliminar la relación ciudad-viaje',
            error: error.message
        });
    }
};

module.exports = {
    getCiudadesViajes,
    getCiudadesViajeById,
    createCiudadesViaje,
    deleteCiudadesViaje
};
