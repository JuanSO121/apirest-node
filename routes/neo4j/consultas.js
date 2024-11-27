const express = require('express');
const router = express.Router();
const {
  contratosFinalizados,
  jugadoresConMultiplesEquipos,
  equiposSinContratosActivos,
  jugadoresConMasDeTresEquipos,
  equiposConContratosLargos
} = require('../../controllers/neo4j/consultas');

// Rutas para las consultas
router.get('/contratosFinalizados', contratosFinalizados);
router.get('/jugadoresMultiplesEquipos', jugadoresConMultiplesEquipos);
router.get('/equiposSinContratos', equiposSinContratosActivos);
router.get('/jugadoresTresEquipos', jugadoresConMasDeTresEquipos);
router.get('/equiposContratosLargos', equiposConContratosLargos);

module.exports = router;
