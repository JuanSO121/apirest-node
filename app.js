// apirest-node\app.js
const express = require('express');
const cors = require('cors');
const { bdmysql } = require('./database/MariaDbConnection');
const { dbMongo } = require('./database/MongoDbConnection');  // Importar la conexión a MongoDB
require('dotenv').config();

// Inicializar la app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conectar a la base de datos MySQL
bdmysql.authenticate()
  .then(() => console.log('Conexión exitosa a la base de datos MySQL'))
  .catch(err => console.error('No se pudo conectar a la base de datos MySQL:', err));

// Conectar a la base de datos MongoDB
dbMongo()
  .then(() => console.log('Conexión exitosa a MongoDB'))
  .catch(err => console.error('No se pudo conectar a la base de datos MongoDB:', err));

// Importar las rutas
const personasRoutes = require('./routes/personasRoutes');
const usuariosRoutes = require('./routes/usuariosRoutes');
const vehiculosRoutes = require('./routes/vehiculosRoutes');

// Rutas de la API
app.use('/api/personas', personasRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/vehiculos', vehiculosRoutes);

// Iniciar el servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
