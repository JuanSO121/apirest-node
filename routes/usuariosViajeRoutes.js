const { Router } = require('express');
const {
    getUsuariosViajes,
    getUsuariosViajeById,
    createUsuariosViaje,
    deleteUsuariosViaje
} = require('../controllers/usuariosViajeController');

const router = Router();

router.get('/', getUsuariosViajes);
router.get('/:Usuario_id_usuario/:Viaje_id_viaje', getUsuariosViajeById);
router.post('/', createUsuariosViaje);
router.delete('/:Usuario_id_usuario/:Viaje_id_viaje', deleteUsuariosViaje);

module.exports = router;
