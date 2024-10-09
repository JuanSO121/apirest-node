import express from 'express';
import cors from 'cors';
import { bdmysql } from '../database/MariaDbConnection';  // Conexión MySQL
import dbMongo from '../database/MongoDbConnection';      // Conexión MongoDB
require('dotenv').config();


class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;  // Asegúrate de definir un puerto por defecto
        this.token = process.env.SECRETORPRIVATEKEY;

        // Paths de MySQL (puedes añadir paths específicos para Mongo si es necesario)
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
        };

        // Conexiones a las bases de datos
        this.dbConnection();       // Conectar a MySQL
        this.dbConnectionMongo();  // Conectar a MongoDB

        // Middlewares
        this.middlewares();

        // Rutas
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

    async dbConnectionMongo() {
        try {
            await dbMongo();
            console.log('Connection OK a Mongo.');
        } catch (error) {
            console.error('Error al conectar a MongoDB:', error);
        }
    }

    middlewares() {
        // Configuración de CORS
        this.app.use(cors());

        // Parseo y lectura del body en formato JSON
        this.app.use(express.json());

        // Servir el directorio público
        this.app.use(express.static('public'));
    }

    routes() {
        // Registrar las rutas para MySQL
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
