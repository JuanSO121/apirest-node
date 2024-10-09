const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');
const {
    getVehiculos,
    getVehiculoById,
    createVehiculo,
    updateVehiculo,
    deleteVehiculo
} = require('../controllers/vehiculosController');

const router = Router();

router.get('/', getVehiculos);
router.get('/:id', getVehiculoById);
router.post('/', createVehiculo);
router.put('/:id', updateVehiculo);
router.delete('/:id', deleteVehiculo);

module.exports = router;
