const mongoose = require('mongoose');
require('dotenv').config();

const dbMongo = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_node);
        console.log('Conexión exitosa a MongoDB');
    } catch (error) {
        console.log(error);
        throw new Error('Error al conectar a MongoDB');
    }
}

module.exports = { dbMongo };
