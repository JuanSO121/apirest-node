const express = require('express');
const {
    createEquipo,
  getAllEquipos,
  updateEquipo,
  deleteEquipo
} = require('../../controllers/neo4j/equipo');

const router = express.Router();

router.post('/', createEquipo);
router.get('/', getAllEquipos);
router.put('/:nombre', updateEquipo);
router.delete('/:nombre', deleteEquipo);

module.exports = router;
