const { Router } = require('express');
const { getPersonas, getPersonaById, createPersona, updatePersona, deletePersona } = require('../controllers/personasController');

const router = Router();

router.get('/', getPersonas);
router.get('/:id', getPersonaById);
router.post('/', createPersona);
router.put('/:id', updatePersona);
router.delete('/:id', deletePersona);

module.exports = router;
