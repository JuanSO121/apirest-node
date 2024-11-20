const { Router } = require('express');
const { crearContratacion, obtenerContrataciones, actualizarContratacion, eliminarContratacion, obtenerContratacionesPorFutbolista } = require('../controllers/contrataciones');

const router = Router();

// Rutas de la API
router.post('/', crearContratacion);  // Crear contratación
router.get('/', obtenerContrataciones);  // Obtener todas las contrataciones
router.put('/:id', actualizarContratacion);  // Actualizar una contratación
router.delete('/:id', eliminarContratacion);  // Eliminar una contratación
router.get('/:idFutbolista', obtenerContratacionesPorFutbolista);  // Obtener contrataciones de un futbolista específico

module.exports = router;
