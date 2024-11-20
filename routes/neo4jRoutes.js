const { Router } = require('express');
const { addDeporte, addEquipo, addJugador, addContrato } = require('../controllers/neo4jController');
const router = Router();

// Rutas de Neo4j
router.post('/deporte', addDeporte);
router.post('/equipo', addEquipo);
router.post('/jugador', addJugador);
router.post('/contrato', addContrato);


module.exports = router;
