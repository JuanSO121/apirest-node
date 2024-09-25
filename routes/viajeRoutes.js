const { Router } = require('express');
const {
    getViajes,
    getViajeById,
    createViaje,
    updateViaje,
    deleteViaje
} = require('../controllers/viajeController');

const router = Router();

router.get('/', getViajes);
router.get('/:id', getViajeById);
router.post('/', createViaje);
router.put('/:id', updateViaje);
router.delete('/:id', deleteViaje);

module.exports = router;
