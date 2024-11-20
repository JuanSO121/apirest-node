const { Router } = require('express');
const { obtenerFutbolistas, crearFutbolista, actualizarFutbolista, eliminarFutbolista, obtenerEquiposPorFutbolista,obtenerFutbolistaPorId } = require('../controllers/futbolistas');

const router = Router();

router.get('/', obtenerFutbolistas);
router.get('/:id', obtenerFutbolistaPorId);
router.get('/:idFutbolista/equipo', obtenerEquiposPorFutbolista);
router.post('/', crearFutbolista);
router.put('/:id', actualizarFutbolista);
router.delete('/:id', eliminarFutbolista);

module.exports = router;
