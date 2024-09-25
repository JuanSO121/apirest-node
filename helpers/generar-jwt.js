const jwt = require('jsonwebtoken');
require('dotenv').config();

const generarJWT = (uid = '') => {
    return new Promise((resolve, reject) => {
        const payload = { id_usuario: uid };

        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '4h'
        }, (err, token) => {
            if (err) {
                console.error('Error al generar el JWT:', err);  // Más detalles sobre el error
                reject('No se pudo generar el token');
            } else {
                resolve(token);
            }
        });
    });
};

module.exports = {
    generarJWT
};
