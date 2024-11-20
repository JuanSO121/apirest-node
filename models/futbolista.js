const { Schema, model } = require('mongoose');

const FutbolistaSchema = Schema({
    nombres: {
      type: String,
      required: true
    },
    apellidos: {
      type: String,
      required: true
    },
    fecha_nacimiento: {
      type: Date,
      required: true
    },
    equipo: {
      type: Schema.Types.ObjectId,
      ref: 'Equipo',
      required: false
    },
    edad: {
      type: Number,
      required: true  
    }
}, { collection: 'Futbolistas' });

module.exports = model('Futbolista', FutbolistaSchema);
