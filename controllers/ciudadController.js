const { response, request } = require('express');
const Ciudad = require('../models/ciudad');

// Obtener todas las ciudades
const getCiudades = async (req = request, res = response) => {
    try {
        const ciudades = await Ciudad.findAll();
        res.json({
            ok: true,
            data: ciudades
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error al obtener ciudades',
            error: error.message
        });
    }
};

// Obtener una ciudad por ID
const getCiudadById = async (req = request, res = response) => {
    const { id } = req.params;
    try {
        const ciudad = await Ciudad.findByPk(id);
        if (!ciudad) {
            return res.status(404).json({
                ok: false,
                msg: `No se encontró la ciudad con id ${id}`,
            });
        }
        res.json({
            ok: true,
            data: ciudad
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error al obtener la ciudad',
            error: error.message
        });
    }
};

// Crear una nueva ciudad
const createCiudad = async (req = request, res = response) => {
    const { nombre } = req.body;
    try {
        const nuevaCiudad = await Ciudad.create({ nombre });
        res.status(201).json({
            ok: true,
            data: nuevaCiudad
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error al crear ciudad',
            error: error.message
        });
    }
};

// Actualizar una ciudad
const updateCiudad = async (req = request, res = response) => {
    const { id } = req.params;
    const { nombre } = req.body;
    try {
        const ciudad = await Ciudad.findByPk(id);
        if (!ciudad) {
            return res.status(404).json({
                ok: false,
                msg: `No se encontró la ciudad con id ${id}`,
            });
        }
        await ciudad.update({ nombre });
        res.json({
            ok: true,
            msg: 'Ciudad actualizada con éxito',
            data: ciudad
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error al actualizar la ciudad',
            error: error.message
        });
    }
};

// Eliminar una ciudad
const deleteCiudad = async (req = request, res = response) => {
    const { id } = req.params;
    try {
        const ciudad = await Ciudad.findByPk(id);
        if (!ciudad) {
            return res.status(404).json({
                ok: false,
                msg: `No se encontró la ciudad con id ${id}`,
            });
        }
        await ciudad.destroy();
        res.json({
            ok: true,
            msg: 'Ciudad eliminada con éxito'
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error al eliminar la ciudad',
            error: error.message
        });
    }
};

module.exports = {
    getCiudades,
    getCiudadById,
    createCiudad,
    updateCiudad,
    deleteCiudad
};
