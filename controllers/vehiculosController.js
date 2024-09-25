const { response, request } = require('express');
const Vehiculo = require('../models/vehiculo');

// Obtener todos los vehículos
const getVehiculos = async (req = request, res = response) => {
    try {
        const vehiculos = await Vehiculo.findAll();
        res.json({
            ok: true,
            data: vehiculos
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error al obtener vehículos',
            error: error.message
        });
    }
};

// Obtener un vehículo por ID
const getVehiculoById = async (req = request, res = response) => {
    const { id } = req.params;
    try {
        const vehiculo = await Vehiculo.findByPk(id);
        if (!vehiculo) {
            return res.status(404).json({
                ok: false,
                msg: `No se encontró el vehículo con id ${id}`,
            });
        }
        res.json({
            ok: true,
            data: vehiculo
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error al obtener el vehículo',
            error: error.message
        });
    }
};

// Crear un nuevo vehículo
const createVehiculo = async (req = request, res = response) => {
    const { marca, color, modelo, id_conductor } = req.body;
    try {
        const nuevoVehiculo = await Vehiculo.create({ marca, color, modelo, id_conductor });
        res.status(201).json({
            ok: true,
            data: nuevoVehiculo
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error al crear vehículo',
            error: error.message
        });
    }
};

// Actualizar un vehículo
const updateVehiculo = async (req = request, res = response) => {
    const { id } = req.params;
    const { marca, color, modelo, id_conductor } = req.body;
    try {
        const vehiculo = await Vehiculo.findByPk(id);
        if (!vehiculo) {
            return res.status(404).json({
                ok: false,
                msg: `No se encontró el vehículo con id ${id}`,
            });
        }
        await vehiculo.update({ marca, color, modelo, id_conductor });
        res.json({
            ok: true,
            msg: 'Vehículo actualizado con éxito',
            data: vehiculo
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error al actualizar el vehículo',
            error: error.message
        });
    }
};

// Eliminar un vehículo
const deleteVehiculo = async (req = request, res = response) => {
    const { id } = req.params;
    try {
        const vehiculo = await Vehiculo.findByPk(id);
        if (!vehiculo) {
            return res.status(404).json({
                ok: false,
                msg: `No se encontró el vehículo con id ${id}`,
            });
        }
        await vehiculo.destroy();
        res.json({
            ok: true,
            msg: 'Vehículo eliminado con éxito'
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error al eliminar el vehículo',
            error: error.message
        });
    }
};

module.exports = {
    getVehiculos,
    getVehiculoById,
    createVehiculo,
    updateVehiculo,
    deleteVehiculo
};
