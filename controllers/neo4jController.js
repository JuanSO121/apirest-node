const neo4jModel = require('../models/neo4jModel').default;

// Crear deporte
const addDeporte = async (req, res) => {
    const { nombre, descripcion } = req.body;

    if (!nombre || !descripcion) {
        return res.status(400).json({
            success: false,
            message: 'Nombre y descripción son obligatorios para crear un deporte.',
        });
    }

    try {
        const deporte = await neo4jModel.createDeporte(req.body);
        res.json({
            success: true,
            message: 'Deporte creado con éxito',
            data: deporte,
        });
    } catch (error) {
        console.error('Error al crear deporte:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error al crear deporte',
            error: error.message,
        });
    }
};

// Crear equipo
const addEquipo = async (req, res) => {
    const { nombre, ciudad, deporteNombre } = req.body;

    if (!nombre || !ciudad || !deporteNombre) {
        return res.status(400).json({
            success: false,
            message: 'Nombre, ciudad y nombre del deporte son obligatorios para crear un equipo.',
        });
    }

    try {
        const equipo = await neo4jModel.createEquipo(req.body, deporteNombre);
        res.json({
            success: true,
            message: 'Equipo creado con éxito',
            data: equipo,
        });
    } catch (error) {
        console.error('Error al crear equipo:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error al crear equipo',
            error: error.message,
        });
    }
};

// Crear jugador
const addJugador = async (req, res) => {
    const { nombre, equipoNombre, pais } = req.body;

    if (!nombre || !equipoNombre || !pais) {
        return res.status(400).json({
            success: false,
            message: 'Nombre, equipo y país son obligatorios para crear un jugador.',
        });
    }

    try {
        const jugador = await neo4jModel.createJugador(req.body, equipoNombre, pais);
        res.json({
            success: true,
            message: 'Jugador creado con éxito',
            data: jugador,
        });
    } catch (error) {
        console.error('Error al crear jugador:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error al crear jugador',
            error: error.message,
        });
    }
};

// Crear contrato
const addContrato = async (req, res) => {
    const { fechaInicio, fechaFin, jugadorNombre, equipoNombre } = req.body;

    if (!fechaInicio || !fechaFin || !jugadorNombre || !equipoNombre) {
        return res.status(400).json({
            success: false,
            message: 'Fecha de inicio, fecha de fin, jugador y equipo son obligatorios para crear un contrato.',
        });
    }

    try {
        const contrato = await neo4jModel.createContrato(req.body, jugadorNombre, equipoNombre);
        res.json({
            success: true,
            message: 'Contrato creado con éxito',
            data: contrato,
        });
    } catch (error) {
        console.error('Error al crear contrato:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error al crear contrato',
            error: error.message,
        });
    }
};


module.exports = {
    addDeporte,
    addEquipo,
    addJugador,
    addContrato,
};