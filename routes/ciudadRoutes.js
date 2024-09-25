const { Router } = require('express');
const {
    getCiudades,
    getCiudadById,
    createCiudad,
    updateCiudad,
    deleteCiudad
} = require('../controllers/ciudadController');

const router = Router();

router.get('/', getCiudades);
router.get('/:id', getCiudadById);
router.post('/', createCiudad);
router.put('/:id',updateCiudad)
router.delete('/:id', deleteCiudad)


module.exports = router;