
const { getSession } = require('../../database/Neo4jConnection');

const session = getSession();


const createEquipo = async (req, res) => {
    try {
      const { nombre, pais, deporte } = req.body;
  
      if (!nombre || !pais || !deporte) {
        return res.status(400).send({ error: 'Faltan campos obligatorios' });
      }

      if (!/^[a-zA-Z ]+$/.test(nombre)) {
        return res.status(400).send({ error: 'El nombre del equipo solo debe contener letras y espacios' });
      }
  
      // Verificar si ya existe un equipo con el mismo nombre
      const checkEquipoQuery = `
        MATCH (e:Equipo {nombre: $nombre})
        RETURN e
      `;
      const equipoResult = await session.run(checkEquipoQuery, { nombre });
  
      if (equipoResult.records.length > 0) {
        return res.status(400).send({ error: 'Ya existe un equipo con el mismo nombre' });
      }
  
      // Verificar si el nodo Pais existe
      const checkPaisQuery = `
        MATCH (p:Pais {nombre: $pais})
        RETURN p
      `;
      const paisResult = await session.run(checkPaisQuery, { pais });
  
      if (paisResult.records.length === 0) {
        return res.status(400).send({ error: 'El país especificado no existe. Debe ser creado previamente.' });
      }
      const existingPais = paisResult.records[0].get('p').properties;
  
      // Verificar si el nodo Deporte existe
      const checkDeporteQuery = `
        MATCH (d:Deporte {nombre: $deporte})
        RETURN d
      `;
      const deporteResult = await session.run(checkDeporteQuery, { deporte });
  
      if (deporteResult.records.length === 0) {
        return res.status(400).send({ error: 'El deporte especificado no existe. Debe ser creado previamente.' });
      }
      const existingDeporte = deporteResult.records[0].get('d').properties;
  
      const createEquipoQuery = `
        CREATE (e:Equipo {nombre: $nombre})
        RETURN e
      `;
      const newEquipoResult = await session.run(createEquipoQuery, { nombre });
      const createdEquipo = newEquipoResult.records[0].get('e').properties;
  
      // Crear las relaciones
      const createRelationsQuery = `
        MATCH (e:Equipo {nombre: $nombre}), (p:Pais {nombre: $pais}), (d:Deporte {nombre: $deporte})
        MERGE (e)-[:ESTA_EN]->(p)
        MERGE (e)-[:PRACTICA]->(d)
        RETURN e, p, d
      `;
      await session.run(createRelationsQuery, { nombre, pais, deporte });
  
      res.status(201).send({
        message: 'Equipo creado correctamente con relaciones',
        data: {
          equipo: createdEquipo,
          pais: existingPais,
          deporte: existingDeporte,
        },
      });
    } catch (error) {
      console.error('Error al crear el equipo:', error);
      res.status(500).send({ error: 'Error interno del servidor' });
    }
}; 
  

const getAllEquipos = async (req, res) => {
    try {
      const query = `
        MATCH (e:Equipo)-[:ESTA_EN]->(p:Pais),
              (e)-[:PRACTICA]->(d:Deporte)
        RETURN e, p, d
      `;
      const result = await session.run(query);
  
      const equipos = result.records.map(record => {
        return {
          equipo: record.get('e').properties,
          pais: record.get('p').properties,
          deporte: record.get('d').properties
        };
      });
  
      res.status(200).send({ data: equipos });
    } catch (error) {
      console.error('Error al obtener equipos:', error);
      res.status(500).send({ error: 'Error interno del servidor' });
    }
  };
  

const updateEquipo = async (req, res) => {
    try {
      const { nombre: nombreParam } = req.params;
      const { nombre, pais, deporte } = req.body;
  
      if (!nombre && !pais && !deporte) {
        return res.status(400).send({ error: 'Se requiere al menos un campo para actualizar' });
      }
  
      const query = `
        MATCH (e:Equipo {nombre: $nombreParam})
        SET e.nombre = COALESCE($nombre, e.nombre),
            e.pais = COALESCE($pais, e.pais),
            e.deporte = COALESCE($deporte, e.deporte)
        RETURN e
      `;
  
      const result = await session.run(query, { nombreParam, nombre, pais, deporte});
  
      if (result.records.length === 0) {
        return res.status(404).send({ error: 'Equipo no encontrado' });
      }
  
      const updatedEquipo = result.records[0].get('e').properties;
      
      res.status(200).send({ message: 'Equipo actualizado correctamente', data: updatedEquipo });
    } catch (error) {
      console.error('Error al actualizar el equipo:', error);
      res.status(500).send({ error: 'Error interno del servidor' });
    }
  };
  

const deleteEquipo = async (req, res) => {
    try {
      const { nombre } = req.params;
  
      const checkRelationsQuery = `
        MATCH (e:Equipo {nombre: $nombre})-[r]-()
        RETURN r
      `;
      const relationsResult = await session.run(checkRelationsQuery, { nombre });
  
      if (relationsResult.records.length > 0) {
        return res.status(400).send({
          error: 'El equipo no puede ser eliminado porque tiene relaciones existentes.',
        });
      }
  
      const deleteEquipoQuery = `
        MATCH (e:Equipo {nombre: $nombre})
        DELETE e
      `;
      const result = await session.run(deleteEquipoQuery, { nombre });
  
      if (result.summary.counters.updates().nodesDeleted === 0) {
        return res.status(404).send({ error: 'Equipo no encontrado' });
      }
  
      res.status(200).send({ message: 'Equipo eliminado con éxito' });
    } catch (error) {
      console.error('Error al eliminar el equipo:', error);
      res.status(500).send({ message: 'Error al eliminar el equipo' });
    } finally {
      await session.close();
    }
};
  

module.exports = {
    createEquipo,
    getAllEquipos,
    updateEquipo,
    deleteEquipo
};
