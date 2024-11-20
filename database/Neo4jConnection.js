const neo4j = require('neo4j-driver');
require('dotenv').config();

let driver;

const connectNeo4j = async () => {
  if (!driver) {
    try {
      driver = neo4j.driver(
        process.env.NEO4J_URI,
        neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
      );
      await driver.verifyConnectivity();
      console.log('Conexión exitosa a Neo4j.');
    } catch (error) {
      console.error('Error al conectar a Neo4j:', error);
      throw error;
    }
  }
  return driver;
};

const getSession = (mode = neo4j.session.WRITE) => {
  if (!driver) {
    throw new Error('El driver de Neo4j no está conectado.');
  }
  return driver.session({ defaultAccessMode: mode });
};

const closeNeo4jConnection = async () => {
  if (driver) {
    await driver.close();
    console.log('Conexión a Neo4j cerrada.');
    driver = null; // Asegurarse de limpiar el driver.
  }
};

module.exports = { connectNeo4j, getSession, closeNeo4jConnection };
