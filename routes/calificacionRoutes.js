const { Router } = require('express');
const {
    getCalificaciones,
    getCalificacionById,
    createCalificacion,
    updateCalificacion,
    deleteCalificacion
} = require('../controllers/calificacionController');

const router = Router();

router.get('/', getCalificaciones);
router.get('/:id', getCalificacionById);
router.post('/', createCalificacion);
router.put('/:id', updateCalificacion);
router.delete('/:id', deleteCalificacion);

module.exports = router;
