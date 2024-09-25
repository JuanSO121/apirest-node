// apirest-node\app.js
const express = require('express');
const cors = require('cors');
const app = express();
const { bdmysql } = require('./database/MariaDbConnection');
require('dotenv').config();

// Middlewares
app.use(cors());
app.use(express.json());

// Probar la conexión a la base de datos
bdmysql.authenticate()
  .then(() => console.log('Conexión exitosa a la base de datos'))
  .catch(err => console.error('No se pudo conectar a la base de datos:', err));

// Importar las rutas
const personasRoutes = require('./routes/personasRoutes');
app.use('/api/personas', personasRoutes);

const usuariosRoutes = require('./routes/usuariosRoutes');
app.use('/api/usuarios', usuariosRoutes);

// Iniciar el servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
