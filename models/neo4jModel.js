
const { getSession } = require('../database/Neo4jConnection');


// Función para crear un equipo y asociarlo con un deporte
const createEquipo = async (equipo, deporteNombre) => {
    const session = getSession();
    try {
        const { nombre, ciudad } = equipo;
        const query = `
            MATCH (d:Deporte {nombre: $deporteNombre})
            MERGE (e:Equipo {nombre: $nombre})
            ON CREATE SET e.ciudad = $ciudad
            MERGE (e)-[:PRACTICA]->(d)
            RETURN e
        `;
        const result = await session.run(query, { nombre, ciudad, deporteNombre });
        return result.records[0]?.get('e').properties;
    } catch (error) {
        console.error('Error al crear equipo:', error);
        throw error;
    } finally {
        await session.close();
    }
};

// Función para crear un jugador y asociarlo con un equipo y país
const createJugador = async (jugador, equipoNombre, pais) => {
    const session = getSession();
    try {
        const { nombre, sexo, fechaNacimiento, ciudadNacimiento } = jugador;
        const query = `
            MATCH (e:Equipo {nombre: $equipoNombre})
            MERGE (p:Pais {nombre: $pais})
            MERGE (j:Jugador {nombre: $nombre})
            ON CREATE SET j.sexo = $sexo, j.fechaNacimiento = $fechaNacimiento, j.ciudadNacimiento = $ciudadNacimiento
            MERGE (j)-[:PERTENECE_A]->(e)
            MERGE (j)-[:NACIDO_EN]->(p)
            RETURN j
        `;
        const result = await session.run(query, { nombre, sexo, fechaNacimiento, ciudadNacimiento, equipoNombre, pais });
        return result.records[0]?.get('j').properties;
    } catch (error) {
        console.error('Error al crear jugador:', error);
        throw error;
    } finally {
        await session.close();
    }
};

// Función para crear un contrato entre un jugador y un equipo
const createContrato = async (contrato, jugadorNombre, equipoNombre) => {
    const session = getSession();
    try {
        const { fechaInicio, fechaFin, valor } = contrato;
        const query = `
            MATCH (j:Jugador {nombre: $jugadorNombre})-[:PERTENECE_A]->(e:Equipo {nombre: $equipoNombre})
            MERGE (j)-[c:CONTRATO]->(e)
            ON CREATE SET c.fechaInicio = $fechaInicio, c.fechaFin = $fechaFin, c.valor = $valor
            RETURN j, e
        `;
        const result = await session.run(query, { fechaInicio, fechaFin, valor, jugadorNombre, equipoNombre });
        return result.records.map(record => ({
            jugador: record.get('j').properties,
            equipo: record.get('e').properties,
        }));
    } catch (error) {
        console.error('Error al crear contrato:', error);
        throw error;
    } finally {
        await session.close();
    }
};

// Exportar funciones usando CommonJS
module.exports = {
    createEquipo,
    createJugador,
    createContrato,
};
