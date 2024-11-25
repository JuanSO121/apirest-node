const Server = require('./server');
const {Usuario} = require('./usuario');
const {Personas, PersonaBk} = require('./personas');
const Equipo = require('./equipo');
const { system_state } = require('./system_state.model');
const {Deporte} = require('./neo4j/deporte')

module.exports = {
    Server,

    Usuario,
    Personas,  
    system_state,
    PersonaBk,
    Equipo,
    Deporte
}

