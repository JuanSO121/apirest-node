
const { getSession } = require('../../database/Neo4jConnection');

const session = getSession();

const crearDeporte = async (req, res) => {
    const {nombre, categoria } = req.body;
    const nombreValido = /^[a-zA-Z\s]+$/;
    const categoriasValidas = ['individual', 'colectivo', 'mixto'];
    try {

      if (!categoriasValidas.includes(categoria)) {
          return res.status(400).send({ error: 'Categoría inválida. Las categorías válidas son: individual, colectivo, mixto.' });
      }

      if (!nombreValido.test(nombre)) {
        return res.status(400).send({ error: 'El nombre del deporte solo puede contener letras y espacios.' });
      }

      const checkDeporteQuery = `
        MATCH (d:Deporte {nombre: $nombre})
        RETURN d
      `;
      const result = await session.run(checkDeporteQuery, { nombre });

      if (result.records.length > 0) {
        return res.status(400).send({ error: `Ya existe un deporte con el nombre ${nombre}.` });
      }

      const crearDeporte = `
      CREATE (d:Deporte {
        nombre: $nombre,
        categoria: $categoria
      })
      RETURN d
    `;
    const crearresult = await session.run(crearDeporte, {
      nombre,
      categoria
    });

    const creardeporte = crearresult.records[0].get('d').properties;
    res.status(201).send({
      message: 'Deporte creado correctamente',
      data: creardeporte,
    });

    } catch (err) {
      console.error('Error al crear el deporte:', err);
      throw new Error(err.message || 'No se pudo crear el deporte');
    } finally {
      await session.close();
    }
  }


const MostrarDeportes = async (req, res) => {
    try {
      const query = `MATCH (d:Deporte) RETURN d`;
      const result = await session.run(query);
  
      const deportes = result.records.map(record => record.get('d').properties);
      res.status(200).send({ data: deportes });
    } catch (error) {
      console.error('Error al obtener deportes:', error);
      res.status(500).send({ error: 'Error interno del servidor' });
    }
  };


const ActualizarDeporte = async (req, res) => {
    try {
      const { nombre: nombreParam } = req.params; 
      const { nombre, categoria } = req.body; 
      const categoriasValidas = ['individual', 'colectivo', 'mixto'];
  
      if (!nombre && !categoria) {
        return res.status(400).send({ error: 'Se requiere al menos un campo para actualizar' });
      }
  
      if (categoria && !categoriasValidas.includes(categoria)) {
        return res.status(400).send({ error: 'Categoría inválida. Las categorías válidas son: individual, colectivo, mixto.' });
      }
  
      const query = `
        MATCH (d:Deporte {nombre: $nombreParam})
        SET d.nombre = COALESCE($nombre, d.nombre), 
            d.categoria = COALESCE($categoria, d.categoria)
        RETURN d
      `;
  
      const result = await session.run(query, { nombreParam, nombre, categoria });
  
      if (result.records.length === 0) {
        return res.status(404).send({ error: 'Deporte no encontrado' });
      }
  
      const updatedDeporte = result.records[0].get('d').properties;
      res.status(200).send({ message: 'Deporte actualizado correctamente', data: updatedDeporte });
    } catch (error) {
      console.error('Error al actualizar el deporte:', error);
      res.status(500).send({ error: 'Error interno del servidor' });
    }
};
  
  
const EliminarDeporte = async (req, res) => {
  try {
    const { nombre } = req.params;

    if (!nombre || nombre.trim().length === 0) {
      return res.status(400).send({ error: 'El nombre del deporte es obligatorio.' });
    }

    const checkRelationsQuery = `
      MATCH (d:Deporte {nombre: $nombre})-[r]-()
      RETURN r
    `;
    const relationsResult = await session.run(checkRelationsQuery, { nombre });

    if (relationsResult.records.length > 0) {
      return res.status(400).send({ 
        error: 'El deporte no puede ser eliminado porque tiene relaciones existentes.' 
      });
    }

    const deleteQuery = `
      MATCH (d:Deporte {nombre: $nombre})
      DELETE d
    `;
    const result = await session.run(deleteQuery, { nombre });

    if (result.summary.counters.updates().nodesDeleted === 0) {
      return res.status(404).send({ error: 'Deporte no encontrado' });
    }

    res.status(200).send({ message: 'Deporte eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el deporte:', error);
    res.status(500).send({ error: 'Error interno del servidor' });
  }
};


module.exports = {
    crearDeporte,
    MostrarDeportes,
    ActualizarDeporte,
    EliminarDeporte
};