const { Router } = require('express');
const { getUsuarios, getUsuarioById, loginPost, updateUsuario, deleteUsuario, postUsuario  } = require('../controllers/usuariosController');
const { validarJWT } = require('../middlewares/validar-jwt');
const { Usuarios } = require('../models/usuario'); // Asegúrate de que esta ruta sea correcta

const router = Router();

// Rutas protegidas con el middleware validarJWT
router.get('/all', validarJWT, getUsuarios);
router.get('/data/:id', getUsuarioById);
router.post('/registro', postUsuario);
router.put('/update/:id', validarJWT, updateUsuario);
router.delete('/delete/:id', validarJWT, deleteUsuario);

// Ruta de login (no necesita autenticación previa)
router.post('/login', loginPost);

module.exports = router;

