const jwt = require('jsonwebtoken');
const { Usuarios } = require('../models/usuario');
require('dotenv').config();

const validarJWT = async (req, res, next) => {
    // Leer el token del header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ msg: 'No hay token en la petición' });
    }

    try {
        // Verificar el token y extraer el ID del usuario
        const { id_usuario } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        req.id_usuario = id_usuario;

        // Revalidar si el usuario existe
        const usuario = await Usuarios.findByPk(id_usuario);
        if (!usuario) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        next();
    } catch (error) {
        console.error('Error al validar el JWT:', error);

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ msg: 'Token expirado' });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ msg: 'Token no válido' });
        } else {
            return res.status(500).json({ msg: 'Error al validar el token' });
        }
    }
};

module.exports = { validarJWT };
