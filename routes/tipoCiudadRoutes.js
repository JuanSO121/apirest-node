const { Router } = require('express');
const {
    getTiposCiudad,
    getTipoCiudadById,
    createTipoCiudad,
    updateTipoCiudad,
    deleteTipoCiudad
} = require('../controllers/tipoCiudadController');

const router = Router();

router.get('/', getTiposCiudad);
router.get('/:id', getTipoCiudadById);
router.post('/', createTipoCiudad);
router.put('/:id', updateTipoCiudad);
router.delete('/:id', deleteTipoCiudad);

module.exports = router;
