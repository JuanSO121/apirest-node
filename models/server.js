const express = require('express');
const cors = require('cors');
const { bdmysql } = require('../database/MariaDbConnection');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.token = process.env.SECRETORPRIVATEKEY;

        // Definir los paths para cada recurso
        this.pathsMySql = {
            auth: '/api/auth',
            prueba: '/api/prueba',
            personas: '/api/personas',
            usuarios: '/api/usuarios',
            vehiculos: '/api/vehiculos',
            viajes: '/api/viajes',
            calificaciones: '/api/calificaciones',
            ciudades: '/api/ciudades',
            tipos_ciudades: '/api/tipos_ciudades',
            ciudades_viajes: '/api/ciudades_viajes',
            usuarios_viajes: '/api/usuarios_viajes',
        }

        // Respuesta por defecto en la raíz
        this.app.get('/', function (req, res) {
            res.send('Hola Mundo a todos...')
        });

        // Conectar a la base de datos
        this.dbConnection();

        // Configurar middlewares
        this.middlewares();

        // Configurar rutas
        this.routes();
    }

    async dbConnection() {
        try {
            await bdmysql.authenticate();
            console.log('Connection OK a MySQL.');
        } catch (error) {
            console.error('No se pudo Conectar a la BD MySQL', error);
        }
    }

    middlewares() {
        // Configurar CORS
        this.app.use(cors());

        // Parseo y lectura del body en formato JSON
        this.app.use(express.json());

        // Servir el directorio público
        this.app.use(express.static('public'));
    }

    routes() {
        // Registrar las rutas para cada recurso
        this.app.use(this.pathsMySql.personas, require('../routes/personasRoutes'));
        this.app.use(this.pathsMySql.usuarios, require('../routes/usuariosRoutes'));
        this.app.use(this.pathsMySql.vehiculos, require('../routes/vehiculosRoutes'));
        this.app.use(this.pathsMySql.prueba, require('../routes/prueba'));
        this.app.use(this.pathsMySql.viajes, require('../routes/viajeRoutes'));
        this.app.use(this.pathsMySql.calificaciones, require('../routes/calificacionRoutes'));
        this.app.use(this.pathsMySql.ciudades, require('../routes/ciudadRoutes'));
        this.app.use(this.pathsMySql.tipos_ciudades, require('../routes/tipoCiudadRoutes'));
        this.app.use(this.pathsMySql.ciudades_viajes, require('../routes/ciudadesViajeRoutes'));
        this.app.use(this.pathsMySql.usuarios_viajes, require('../routes/usuariosViajeRoutes'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        });
    }
}

module.exports = Server;
