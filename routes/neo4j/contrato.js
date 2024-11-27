const express = require('express');
const router = express.Router();
const {
  crearContrato,
  obtenerContratos,
  actualizarContrato,
  eliminarContrato,
} = require('../../controllers/neo4j/contrato'); // Asegúrate de que el path sea correcto

// Crear un contrato
router.post('/', crearContrato);

// Obtener todos los contratos
router.get('/', obtenerContratos);

// Actualizar un contrato
router.put('/:jugador/:equipo', actualizarContrato);

// Eliminar un contrato
router.delete('/:jugador/:equipo', eliminarContrato);

module.exports = router;
