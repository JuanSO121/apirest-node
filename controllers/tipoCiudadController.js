const { request, response } = require('express');
const TipoCiudad = require('../models/tipoCiudad');

// Obtener todos los tipos de ciudad
const getTiposCiudad = async (req = request, res = response) => {
    try {
        const tiposCiudad = await TipoCiudad.findAll();
        res.json({
            ok: true,
            data: tiposCiudad
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error al obtener los tipos de ciudad',
            error: error.message
        });
    }
};

// Obtener un tipo de ciudad por ID
const getTipoCiudadById = async (req = request, res = response) => {
    const { id } = req.params;
    try {
        const tipoCiudad = await TipoCiudad.findByPk(id);
        if (!tipoCiudad) {
            return res.status(404).json({
                ok: false,
                msg: `No se encontró el tipo de ciudad con id ${id}`,
            });
        }
        res.json({
            ok: true,
            data: tipoCiudad
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error al obtener el tipo de ciudad',
            error: error.message
        });
    }
};

// Crear un nuevo tipo de ciudad
const createTipoCiudad = async (req = request, res = response) => {
    const { nombre_tipo_ciudad } = req.body;
    try {
        const nuevoTipoCiudad = await TipoCiudad.create({ nombre_tipo_ciudad });
        res.status(201).json({
            ok: true,
            data: nuevoTipoCiudad
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error al crear el tipo de ciudad',
            error: error.message
        });
    }
};

// Actualizar un tipo de ciudad
const updateTipoCiudad = async (req = request, res = response) => {
    const { id } = req.params;
    const { nombre_tipo_ciudad } = req.body;
    try {
        const tipoCiudad = await TipoCiudad.findByPk(id);
        if (!tipoCiudad) {
            return res.status(404).json({
                ok: false,
                msg: `No se encontró el tipo de ciudad con id ${id}`,
            });
        }
        await tipoCiudad.update({ nombre_tipo_ciudad });
        res.json({
            ok: true,
            msg: 'Tipo de ciudad actualizado con éxito',
            data: tipoCiudad
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error al actualizar el tipo de ciudad',
            error: error.message
        });
    }
};

// Eliminar un tipo de ciudad
const deleteTipoCiudad = async (req = request, res = response) => {
    const { id } = req.params;
    try {
        const tipoCiudad = await TipoCiudad.findByPk(id);
        if (!tipoCiudad) {
            return res.status(404).json({
                ok: false,
                msg: `No se encontró el tipo de ciudad con id ${id}`,
            });
        }
        await tipoCiudad.destroy();
        res.json({
            ok: true,
            msg: 'Tipo de ciudad eliminado con éxito'
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error al eliminar el tipo de ciudad',
            error: error.message
        });
    }
};

module.exports = {
    getTiposCiudad,
    getTipoCiudadById,
    createTipoCiudad,
    updateTipoCiudad,
    deleteTipoCiudad
};
