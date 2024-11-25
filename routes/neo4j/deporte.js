const express = require('express');
const { crearDeporte,
        MostrarDeportes,
        ActualizarDeporte,
        EliminarDeporte
 } = 
require('../../controllers/neo4j/deporte');
const router = express.Router();

router.post('/', crearDeporte);
router.get('/', MostrarDeportes);
router.put('/:nombre', ActualizarDeporte);
router.delete('/:nombre', EliminarDeporte);

module.exports = router;
