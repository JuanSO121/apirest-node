const { Schema, model } = require('mongoose');

const ContratacionSchema = Schema({
    futbolista: {
        type: Schema.Types.ObjectId,
        ref: 'Futbolista',
        required: true
    },
    equipo: {
        type: Schema.Types.ObjectId,
        ref: 'Equipo',
        required: false
    },
    fecha_inicio: {
        type: Date,
        required: true
    },
    fecha_fin: {
        type: Date,
        required: false  
    }
}, { collection: 'Contrataciones' });

module.exports = model('Contratacion', ContratacionSchema);
