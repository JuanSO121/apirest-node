import express from 'express';
import cors from 'cors';
import { bdmysql } from '../database/MariaDbConnection';  // Conexión MySQL
import dbMongo from '../database/MongoDbConnection';      // Conexión MongoDB
import { connectNeo4j, closeNeo4jConnection } from '../database/Neo4jConnection'; // Conexión Neo4j

require('dotenv').config();

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000; // Puerto predeterminado
        this.token = process.env.SECRETORPRIVATEKEY;

        // Paths para las APIs
        this.paths = {
            auth: '/api/auth',
            prueba: '/api/prueba',
            personas: '/api/personas',
            usuarios: '/api/usuarios',
            vehiculos: '/api/vehiculos',
            futbolistas: '/api/futbolistas',
            equipos: '/api/equipos',
            contrataciones: '/api/contrataciones',
            neo4j: '/api/neo4j', // Ruta para operaciones específicas de Neo4j
        };

        // Conexiones a bases de datos
        this.initDatabaseConnections();

        // Middlewares
        this.middlewares();

        // Rutas
        this.routes();
    }

    // Método para inicializar las conexiones a las bases de datos
    async initDatabaseConnections() {
        try {
            await this.dbConnectionMySQL();
            await this.dbConnectionMongo();
            await this.dbConnectionNeo4j(); // Conexión a Neo4j
        } catch (error) {
            console.error('Error al iniciar las conexiones:', error);
        }
    }

    // Conexión a MySQL
    async dbConnectionMySQL() {
        try {
            await bdmysql.authenticate();
            console.log('Conexión exitosa a MySQL.');
        } catch (error) {
            console.error('No se pudo conectar a MySQL:', error);
        }
    }

    // Conexión a MongoDB
    async dbConnectionMongo() {
        try {
            await dbMongo();
            console.log('Conexión exitosa a MongoDB.');
        } catch (error) {
            console.error('Error al conectar a MongoDB:', error);
        }
    }

    // Conexión a Neo4j
    async dbConnectionNeo4j() {
        try {
            await connectNeo4j();
            console.log('Conexión exitosa a Neo4j.');
        } catch (error) {
            console.error('Error al conectar a Neo4j:', error);
        }
    }

    // Cerrar conexiones al detener el servidor
    async stop() {
        try {
            await closeNeo4jConnection();
            console.log('Conexión a Neo4j cerrada.');
        } catch (error) {
            console.error('Error al cerrar la conexión a Neo4j:', error);
        }
    }

    // Configuración de middlewares
    middlewares() {
        // Configuración de CORS
        this.app.use(cors());

        // Parseo y lectura del body en formato JSON
        this.app.use(express.json());

        // Servir el directorio público
        this.app.use(express.static('public'));
    }

    // Registro de rutas
    routes() {
        this.app.use(this.paths.personas, require('../routes/personasRoutes'));
        this.app.use(this.paths.usuarios, require('../routes/usuariosRoutes'));
        this.app.use(this.paths.vehiculos, require('../routes/vehiculosRoutes'));
        this.app.use(this.paths.prueba, require('../routes/prueba'));
        this.app.use(this.paths.futbolistas, require('../routes/futbolistas'));
        this.app.use(this.paths.equipos, require('../routes/equipos'));
        this.app.use(this.paths.contrataciones, require('../routes/contrataciones'));

        // Rutas para Neo4j
        this.app.use(this.paths.neo4j, require('../routes/neo4jRoutes').default);
    }

    // Método para iniciar el servidor
    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en el puerto', this.port);
        });
    }
}

module.exports = Server;
