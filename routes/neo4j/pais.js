const express = require('express');
const {
  createPais,
  getAllPaises,
  getPaisByNombre,
  updatePais,
  deletePais
} = require('../../controllers/neo4j/pais');

const router = express.Router();


router.post('/', createPais); 
router.get('/', getAllPaises); 
router.get('/:nombre', getPaisByNombre); 
router.put('/:nombre', updatePais); 
router.delete('/:nombre', deletePais); 

module.exports = router;
