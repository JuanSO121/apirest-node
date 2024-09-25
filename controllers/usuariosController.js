const { Usuarios } = require('../models/usuario');
const bcrypt = require('bcrypt');
const { generarJWT } = require('../helpers/generar-jwt');

// Obtener todos los usuarios
const getUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuarios.findAll();
        res.json({ ok: true, data: usuarios });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
};

// Obtener un usuario por ID
const getUsuarioById = async (req, res) => {
    const { id } = req.params;
    try {
        const usuario = await Usuarios.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ ok: false, msg: 'Usuario no encontrado' });
        }
        res.json({ ok: true, data: usuario });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
};


const postUsuario = async (req, res) => {
    const { contraseña, email, numero_telefono, minibiografia, id_persona } = req.body;
    try {
        // Generar un hash para la contraseña
        const saltRounds = 8;
        const hashedcontraseña = await bcrypt.hash(contraseña, saltRounds);

        // Crear el nuevo usuario con la contraseña encriptada
        const newUsuario = await Usuarios.create({
            contraseña: hashedcontraseña,
            email,
            numero_telefono,
            minibiografia,
            id_persona
        });

        res.status(201).json({ ok: true, data: newUsuario });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
};

// Actualizar un usuario existente
const updateUsuario = async (req, res) => {
    const { id } = req.params;
    const { password, email, numero_telefono, minibiografia, id_persona, oldPassword } = req.body; // Cambiado a oldPassword

    try {
        const usuario = await Usuarios.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ ok: false, msg: 'Usuario no encontrado' });
        }

        // Validar la contraseña antigua
        if (oldPassword) {
            const isMatch = await bcrypt.compare(oldPassword, usuario.contraseña); // Asegúrate de que esto sea correcto
            if (!isMatch) {
                return res.status(401).json({ ok: false, msg: 'Contraseña incorrecta' });
            }
        } else {
            return res.status(400).json({ ok: false, msg: 'Se requiere la contraseña antigua para actualizar los datos.' });
        }

        // Si se proporciona una nueva contraseña, encriptarla
        let newPassword = usuario.contraseña;
        if (password) {
            const saltRounds = 8;
            newPassword = await bcrypt.hash(password, saltRounds);
        }

        // Actualizar el usuario
        await usuario.update({
            contraseña: newPassword,
            email,
            numero_telefono: parseInt(numero_telefono), // Asegúrate de que esto sea un número
            minibiografia,
            id_persona
        });

        res.json({ ok: true, data: usuario });
    } catch (error) {
        console.error('Error actualizando usuario:', error);
        res.status(500).json({ ok: false, error: error.message });
    }
};



// Eliminar un usuario
const deleteUsuario = async (req, res) => {
    const { id } = req.params;
    const { password } = req.query; // La contraseña enviada como parámetro de la URL
    try {
        const usuario = await Usuarios.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ ok: false, msg: 'Usuario no encontrado' });
        }

        // Validar la contraseña antes de eliminar
        const isMatch = await bcrypt.compare(password, usuario.contraseña);
        if (!isMatch) {
            return res.status(401).json({ ok: false, msg: 'Contraseña incorrecta' });
        }

        await usuario.destroy();
        res.json({ ok: true, msg: 'Usuario eliminado' });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
};


const loginPost = async (req, res) => {
    const { email, contraseña } = req.body;
    
    try {
        const usuario = await Usuarios.findOne({ where: { email: email } });
        
        if (!usuario) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }
        
        if (!(await bcrypt.compare(contraseña, usuario.contraseña))) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }
        
        const token = await generarJWT(usuario.id_usuario);
        console.log('Generated token:', token);
        
        res.json({
            success: true,
            token: token,
            user: {
                id_usuario: usuario.id_usuario,
                email: usuario.email
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al iniciar sesión' });
    }
};



module.exports = {
    getUsuarios,
    getUsuarioById,
    postUsuario,
    updateUsuario,
    deleteUsuario,
    loginPost
};
