const { Router } = require('express');
const { obtenerEquipos, crearEquipo, actualizarEquipo, eliminarEquipo,obtenerFutbolistasDeEquipo } = require('../controllers/equipos');

const router = Router();

router.get('/', obtenerEquipos);
router.post('/', crearEquipo);
router.put('/:id', actualizarEquipo);
router.delete('/:id', eliminarEquipo);
router.get('/:idEquipo/futbolistas', obtenerFutbolistasDeEquipo);

module.exports = router;
