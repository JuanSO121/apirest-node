const express = require('express');
const { crearJugador, obtenerJugadores, actualizarJugador, eliminarJugador } = require('../../controllers/neo4j/jugador');
const router = express.Router();

router.post('/', crearJugador);
router.get('/', obtenerJugadores);
router.put('/:id', actualizarJugador);
router.delete('/:id', eliminarJugador);

module.exports = router;
