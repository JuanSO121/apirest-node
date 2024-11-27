const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { dbMongo } = require('./database/MongoDbConnection');
const { connectNeo4j, closeNeo4jConnection } = require('./database/Neo4jConnection');

// Inicializar la app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conectar a MongoDB
//(async () => {
//  try {
//    await dbMongo();
//    console.log('Conexión exitosa a MongoDB.');
//  } catch (err) {
//    console.error('Error al conectar a MongoDB:', err);
//  }
//})();

// Conectar a Neo4j
(async () => {
  try {
    await connectNeo4j();
    console.log('Conexión exitosa a Neo4j.');
  } catch (err) {
    console.error('Error al conectar a Neo4j:', err);
  }
})();

// Rutas de la API
try {
  const routes = {
    personas: require('./routes/personasRoutes'),
    usuarios: require('./routes/usuariosRoutes'),
    vehiculos: require('./routes/vehiculosRoutes'),
    equipos: require('./routes/equipos'),
    futbolistas: require('./routes/futbolistas'),
    contrataciones: require('./routes/contrataciones'),
    deporte: require('./routes/neo4j/deporte'),
    equipo: require('./routes/neo4j/equipo'),
    pais: require('./routes/neo4j/pais'),
    contrato: require('./routes/neo4j/contrato'),
    jugador: require('./routes/neo4j/jugador'),
    consultas: require('./routes/neo4j/consultas')
  };
  
  app.use('/api/personas', routes.personas);
  app.use('/api/usuarios', routes.usuarios);
  app.use('/api/vehiculos', routes.vehiculos);
  app.use('/api/equipos', routes.equipos);
  app.use('/api/futbolistas', routes.futbolistas);
  app.use('/api/contrataciones', routes.contrataciones);
  

  app.use('/api/neo4j/deporte', routes.deporte);
  app.use('/api/neo4j/equipo', routes.equipo)
  app.use('/api/neo4j/pais', routes.pais)
  app.use('/api/neo4j/jugador', routes.jugador)
  app.use('/api/neo4j/contrato', routes.contrato)
  app.use('/api/neo4j/consultas', routes.consultas)
} catch (err) {
  console.error('Error al cargar rutas:', err);
}

// Cerrar conexiones al detener el servidor
process.on('SIGINT', async () => {
  try {
    await closeNeo4jConnection();
    console.log('Conexión a Neo4j cerrada.');
  } catch (err) {
    console.error('Error al cerrar la conexión a Neo4j:', err);
  } finally {
    process.exit();
  }
});

// Iniciar el servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT,  () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
}
);

