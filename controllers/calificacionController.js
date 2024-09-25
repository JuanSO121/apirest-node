const { response, request } = require('express');
const Calificacion = require('../models/calificacion');

// Obtener todas las calificaciones
const getCalificaciones = async (req = request, res = response) => {
    try {
        const calificaciones = await Calificacion.findAll();
        res.json({
            ok: true,
            data: calificaciones
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error al obtener calificaciones',
            error: error.message
        });
    }
};

// Obtener una calificación por ID
const getCalificacionById = async (req = request, res = response) => {
    const { id } = req.params;
    try {
        const calificacion = await Calificacion.findByPk(id);
        if (!calificacion) {
            return res.status(404).json({
                ok: false,
                msg: `No se encontró la calificación con id ${id}`,
            });
        }
        res.json({
            ok: true,
            data: calificacion
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error al obtener la calificación',
            error: error.message
        });
    }
};

// Crear una nueva calificación
const createCalificacion = async (req = request, res = response) => {
    const { puntuacion, comentario, fecha_calificacion, id_calificador, id_calificado, id_viaje } = req.body;
    try {
        const nuevaCalificacion = await Calificacion.create({
            puntuacion,
            comentario,
            fecha_calificacion,
            id_calificador,
            id_calificado,
            id_viaje
        });
        res.status(201).json({
            ok: true,
            data: nuevaCalificacion
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error al crear calificación',
            error: error.message
        });
    }
};

// Actualizar una calificación
const updateCalificacion = async (req = request, res = response) => {
    const { id } = req.params;
    const { puntuacion, comentario, fecha_calificacion, id_calificador, id_calificado, id_viaje } = req.body;
    try {
        const calificacion = await Calificacion.findByPk(id);
        if (!calificacion) {
            return res.status(404).json({
                ok: false,
                msg: `No se encontró la calificación con id ${id}`,
            });
        }
        await calificacion.update({
            puntuacion,
            comentario,
            fecha_calificacion,
            id_calificador,
            id_calificado,
            id_viaje
        });
        res.json({
            ok: true,
            msg: 'Calificación actualizada con éxito',
            data: calificacion
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error al actualizar la calificación',
            error: error.message
        });
    }
};

// Eliminar una calificación
const deleteCalificacion = async (req = request, res = response) => {
    const { id } = req.params;
    try {
        const calificacion = await Calificacion.findByPk(id);
        if (!calificacion) {
            return res.status(404).json({
                ok: false,
                msg: `No se encontró la calificación con id ${id}`,
            });
        }
        await calificacion.destroy();
        res.json({
            ok: true,
            msg: 'Calificación eliminada con éxito'
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error al eliminar la calificación',
            error: error.message
        });
    }
};

module.exports = {
    getCalificaciones,
    getCalificacionById,
    createCalificacion,
    updateCalificacion,
    deleteCalificacion
};
