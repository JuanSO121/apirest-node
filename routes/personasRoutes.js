const { Router } = require('express');
const { getPersonas, getPersonaById, createPersona, updatePersona, deletePersona } = require('../controllers/personasController');
const { obtenerEquipos, obtenerEquipoById, crearEquipo, actualizarEquipo, eliminarEquipo } = require('../controllers/personasController'); // Para MongoDB

const router = Router();

// Rutas para la base de datos MySQL (Personas)
router.get('/mysql/personas', getPersonas);         // Obtener todas las personas
router.get('/mysql/personas/:id', getPersonaById);  // Obtener persona por ID
router.post('/mysql/personas', createPersona);      // Crear nueva persona
router.put('/mysql/personas/:id', updatePersona);   // Actualizar persona
router.delete('/mysql/personas/:id', deletePersona); // Eliminar persona

// // Rutas para la base de datos MongoDB (Equipos)
// router.get('/mongodb/equipos', obtenerEquipos);         // Obtener todos los equipos
// router.get('/mongodb/equipos/:id', obtenerEquipoById);  // Obtener equipo por ID
// router.post('/mongodb/equipos', crearEquipo);           // Crear nuevo equipo
// router.put('/mongodb/equipos/:id', actualizarEquipo);   // Actualizar equipo
// router.delete('/mongodb/equipos/:id', eliminarEquipo);  // Eliminar equipo

module.exports = router;
