const { response, request } = require('express');
const Viaje = require('../models/viaje');

// Obtener todos los viajes
const getViajes = async (req = request, res = response) => {
    try {
        const viajes = await Viaje.findAll();
        res.json({
            ok: true,
            data: viajes
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error al obtener viajes',
            error: error.message
        });
    }
};

// Obtener un viaje por ID
const getViajeById = async (req = request, res = response) => {
    const { id } = req.params;
    try {
        const viaje = await Viaje.findByPk(id);
        if (!viaje) {
            return res.status(404).json({
                ok: false,
                msg: `No se encontró el viaje con id ${id}`,
            });
        }
        res.json({
            ok: true,
            data: viaje
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error al obtener el viaje',
            error: error.message
        });
    }
};

// Crear un nuevo viaje
const createViaje = async (req = request, res = response) => {
    const { fecha_salida, precio, distancia_ruta, id_vehiculo } = req.body;
    try {
        const nuevoViaje = await Viaje.create({ fecha_salida, precio, distancia_ruta, id_vehiculo });
        res.status(201).json({
            ok: true,
            data: nuevoViaje
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error al crear viaje',
            error: error.message
        });
    }
};

// Actualizar un viaje
const updateViaje = async (req = request, res = response) => {
    const { id } = req.params;
    const { fecha_salida, precio, distancia_ruta, id_vehiculo } = req.body;
    try {
        const viaje = await Viaje.findByPk(id);
        if (!viaje) {
            return res.status(404).json({
                ok: false,
                msg: `No se encontró el viaje con id ${id}`,
            });
        }
        await viaje.update({ fecha_salida, precio, distancia_ruta, id_vehiculo });
        res.json({
            ok: true,
            msg: 'Viaje actualizado con éxito',
            data: viaje
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error al actualizar el viaje',
            error: error.message
        });
    }
};

// Eliminar un viaje
const deleteViaje = async (req = request, res = response) => {
    const { id } = req.params;
    try {
        const viaje = await Viaje.findByPk(id);
        if (!viaje) {
            return res.status(404).json({
                ok: false,
                msg: `No se encontró el viaje con id ${id}`,
            });
        }
        await viaje.destroy();
        res.json({
            ok: true,
            msg: 'Viaje eliminado con éxito'
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error al eliminar el viaje',
            error: error.message
        });
    }
};

module.exports = {
    getViajes,
    getViajeById,
    createViaje,
    updateViaje,
    deleteViaje
};
