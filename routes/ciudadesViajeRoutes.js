const { Router } = require('express');
const {
    getCiudadesViajes,
    getCiudadesViajeById,
    createCiudadesViaje,
    deleteCiudadesViaje
} = require('../controllers/ciudadesViajeController');

const router = Router();

router.get('/', getCiudadesViajes);
router.get('/:id_viaje/:id_tipo_ciudad/:id_ciudad', getCiudadesViajeById);
router.post('/', createCiudadesViaje);
router.delete('/:id_viaje/:id_tipo_ciudad/:id_ciudad', deleteCiudadesViaje);

module.exports = router;
