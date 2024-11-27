const { getSession } = require('../../database/Neo4jConnection');

const contratosFinalizados = async (req, res) => {
    const session = getSession();
    
    try {
      const query = `
        MATCH (j:Jugador)-[:TIENE_CONTRATO]->(c:Contrato)-[:PERTENECE_A]->(e:Equipo)
        WHERE date(c.fin) < date()  // Filtra contratos finalizados
        RETURN j.nombre AS Deportista, e.nombre AS Equipo, c.salario AS Salario, c.inicio AS FechaInicio, c.fin AS FechaFin
        ORDER BY c.fin DESC
      `;
      const result = await session.run(query);
  
      const contratos = result.records.map(record => ({
        deportista: record.get('Deportista'),
        equipo: record.get('Equipo'),
        salario: record.get('Salario'),
        fechaInicio: record.get('FechaInicio'),
        fechaFin: record.get('FechaFin'),
      }));
  
      if (contratos.length === 0) {
        return res.status(404).send({ message: 'No se encontraron contratos que hayan finalizado.' });
      }
  
      res.status(200).send({ data: contratos });
    } catch (error) {
      console.error('Error al obtener contratos finalizados:', error);
      res.status(500).send({ error: 'Error interno del servidor' });
    } finally {
      await session.close();
    }
  };
  
  

const jugadoresConMultiplesEquipos = async (req, res) => {
    const session = getSession();
    
    try {
      const query = `
        MATCH (j:Jugador)-[r:TIENE_CONTRATO]->(e:Equipo)
        RETURN j.nombre AS Deportista, COLLECT(DISTINCT e.nombre) AS Equipos, COLLECT(DISTINCT r.inicio) AS Inicio, COLLECT(DISTINCT r.fin) AS Fin
        HAVING LENGTH(Equipos) > 1
        ORDER BY j.nombre
      `;
      const result = await session.run(query);
  
      const jugadores = result.records.map(record => ({
        deportista: record.get('Deportista'),
        equipos: record.get('Equipos'),
        inicio: record.get('Inicio'),
        fin: record.get('Fin'),
      }));
  
      if (jugadores.length === 0) {
        return res.status(404).send({ message: 'No se encontraron jugadores con múltiples equipos.' });
      }
  
      res.status(200).send({ data: jugadores });
    } catch (error) {
      console.error('Error al obtener jugadores con múltiples equipos:', error);
      res.status(500).send({ error: 'Error interno del servidor' });
    } finally {
      await session.close();
    }
  };
  

  
const equiposSinContratosActivos = async (req, res) => {
    const session = getSession();
  
    try {
      const query = `
        MATCH (e:Equipo)
        WHERE NOT EXISTS {
          MATCH (j:Jugador)-[:TIENE_CONTRATO]->(c:Contrato)-[:PERTENECE_A]->(e)
          WHERE date(c.fin) >= date()
        }
        RETURN e.nombre AS Equipo
        ORDER BY e.nombre
      `;
      const result = await session.run(query);
  
      const equipos = result.records.map(record => ({
        equipo: record.get('Equipo'),
      }));
  
      if (equipos.length === 0) {
        return res.status(404).send({ message: 'No se encontraron equipos sin contratos activos.' });
      }
  
      res.status(200).send({ data: equipos });
    } catch (error) {
      console.error('Error al obtener equipos sin contratos activos:', error);
      res.status(500).send({ error: 'Error interno del servidor' });
    } finally {
      await session.close();
    }
  };
  


const jugadoresConMasDeTresEquipos = async (req, res) => {
    const session = getSession();
    
    try {
      const query = `
        MATCH (j:Jugador)-[:TIENE_CONTRATO]->(c:Contrato)-[:PERTENECE_A]->(e:Equipo)
        WITH j, COUNT(DISTINCT e) AS Equipos
        WHERE Equipos > 3
        RETURN j.nombre AS Deportista, Equipos
        ORDER BY Equipos DESC
      `;
      const result = await session.run(query);
  
      const jugadores = result.records.map(record => ({
        deportista: record.get('Deportista'),
        equipos: record.get('Equipos'),
      }));
  
      if (jugadores.length === 0) {
        return res.status(404).send({ message: 'No se encontraron jugadores que hayan jugado en más de 3 equipos.' });
      }
  
      res.status(200).send({ data: jugadores });
    } catch (error) {
      console.error('Error al obtener jugadores con más de 3 equipos:', error);
      res.status(500).send({ error: 'Error interno del servidor' });
    } finally {
      await session.close();
    }
  };
  

  
const equiposConContratosLargos = async (req, res) => {
    const session = getSession();
    
    try {
      const query = `
        MATCH (j:Jugador)-[:TIENE_CONTRATO]->(c:Contrato)-[:PERTENECE_A]->(e:Equipo)
        WHERE duration.between(date(c.inicio), date(c.fin)).years > 3
        RETURN e.nombre AS Equipo, COUNT(j) AS NumeroDeDeportistas
        ORDER BY NumeroDeDeportistas DESC
      `;
      const result = await session.run(query);
  
      const equipos = result.records.map(record => ({
        equipo: record.get('Equipo'),
        numeroDeDeportistas: record.get('NumeroDeDeportistas'),
      }));
  
      if (equipos.length === 0) {
        return res.status(404).send({ message: 'No se encontraron equipos con contratos largos.' });
      }
  
      res.status(200).send({ data: equipos });
    } catch (error) {
      console.error('Error al obtener equipos con contratos largos:', error);
      res.status(500).send({ error: 'Error interno del servidor' });
    } finally {
      await session.close();
    }
  };
  

  module.exports = {
    contratosFinalizados,
    jugadoresConMasDeTresEquipos,
    equiposConContratosLargos,
    equiposSinContratosActivos,
    jugadoresConMultiplesEquipos
} 