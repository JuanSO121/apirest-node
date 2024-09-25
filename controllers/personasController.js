const { Personas } = require('../models/personas');

// Obtener todas las personas
const getPersonas = async (req, res) => {
    try {
        const personas = await Personas.findAll();
        res.json({ ok: true, data: personas });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
};

// Obtener una persona por ID
const getPersonaById = async (req, res) => {
    const { id } = req.params;
    try {
        const persona = await Personas.findByPk(id);
        if (!persona) {
            return res.status(404).json({ ok: false, msg: 'Persona no encontrada' });
        }
        res.json({ ok: true, data: persona });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
};

// Crear una nueva persona
const createPersona = async (req, res) => {
    const { nombres, apellidos, fecha_nacimiento } = req.body;

    try {
        // Verificar si ya existe una persona con el mismo nombre y apellido
        const existePersona = await Personas.findOne({ where: { nombres, apellidos } });

        if (existePersona) {
            // Si ya existe, devuelve un error 400 con un mensaje de error
            res.status(400).json({ ok: false, error: 'Ya existe una persona con el mismo nombre y apellido' });
        } else {
            // Si no existe, crea una nueva persona
            const newPersona = await Personas.create({ nombres, apellidos, fecha_nacimiento });
            res.status(201).json({ ok: true, data: newPersona });
        }
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
};

// Actualizar una persona existente
const updatePersona = async (req, res) => {
    const { id } = req.params;
    const { nombres, apellidos, fecha_nacimiento } = req.body;
    try {
        const persona = await Personas.findByPk(id);
        if (!persona) {
            return res.status(404).json({ ok: false, msg: 'Persona no encontrada' });
        }
        await persona.update({ nombres, apellidos, fecha_nacimiento });
        res.json({ ok: true, data: persona });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
};

// Eliminar una persona
const deletePersona = async (req, res) => {
    const { id } = req.params;
    try {
        const persona = await Personas.findByPk(id);
        if (!persona) {
            return res.status(404).json({ ok: false, msg: 'Persona no encontrada' });
        }
        await persona.destroy();
        res.json({ ok: true, msg: 'Persona eliminada' });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
};

module.exports = {
    getPersonas,
    getPersonaById,
    createPersona,
    updatePersona,
    deletePersona
};
