const { getSession } = require('../../database/Neo4jConnection');

const session = getSession();


const createPais = async (req, res) => {
    try {
      const { nombre, codigo, continente } = req.body;
  
      if (!nombre || !codigo || !continente) {
        return res.status(400).send({ error: 'Faltan campos obligatorios' });
      }
  
      const checkPaisQuery = `
        MATCH (p:Pais)
        WHERE p.nombre = $nombre OR p.codigo = $codigo
        RETURN p
      `;
      const paisResult = await session.run(checkPaisQuery, { nombre, codigo });
  
      if (paisResult.records.length > 0) {
        return res.status(400).send({
          error: 'Ya existe un país con el mismo nombre o código',
        });
      }
  
      const createPaisQuery = `
        CREATE (p:Pais {
          nombre: $nombre,
          codigo: $codigo,
          continente: $continente
        })
        RETURN p
      `;
      const result = await session.run(createPaisQuery, {
        nombre,
        codigo,
        continente,
      });
  
      const createdPais = result.records[0].get('p').properties;
      res.status(201).send({
        message: 'País creado correctamente',
        data: createdPais,
      });
    } catch (error) {
      console.error('Error al crear el país:', error);
      res.status(500).send({ error: 'Error interno del servidor' });
    }
  };
  

const getAllPaises = async (req, res) => {
  try {
    const query = `MATCH (p:Pais) RETURN p`;
    const result = await session.run(query);

    const paises = result.records.map(record => record.get('p').properties);
    res.status(200).send({ data: paises });
  } catch (error) {
    console.error('Error al obtener los países:', error);
    res.status(500).send({ error: 'Error interno del servidor' });
  }
};


const getPaisByNombre = async (req, res) => {
  try {
    const { nombre } = req.params;

    const query = `
      MATCH (p:Pais {nombre: $nombre})
      RETURN p
    `;
    const result = await session.run(query, { nombre });

    if (result.records.length === 0) {
      return res.status(404).send({ error: 'País no encontrado' });
    }

    const pais = result.records[0].get('p').properties;
    res.status(200).send({ data: pais });
  } catch (error) {
    console.error('Error al obtener el país:', error);
    res.status(500).send({ error: 'Error interno del servidor' });
  }
};


const updatePais = async (req, res) => {
    try {
      const { nombre: nombreParam } = req.params;
      const { nombre, codigo, continente } = req.body;
  
      if (!nombre && !codigo && !continente) {
        return res.status(400).send({ error: 'Se requiere al menos un campo para actualizar' });
      }
  
      const query = `
        MATCH (p:Pais {nombre: $nombreParam})
        SET p.nombre = COALESCE($nombre, p.nombre),
            p.codigo = COALESCE($codigo, p.codigo),
            p.continente = COALESCE($continente, p.continente)
        RETURN p
      `;
  
      const result = await session.run(query, {nombreParam, nombre, codigo, continente});
  
      if (result.records.length === 0) {
        return res.status(404).send({ error: 'País no encontrado' });
      }
  
      const updatedPais = result.records[0].get('p').properties;
      
      res.status(200).send({ message: 'País actualizado correctamente', data: updatedPais });
    } catch (error) {
      console.error('Error al actualizar el país:', error);
      res.status(500).send({ error: 'Error interno del servidor' });
    }
  };
  

const deletePais = async (req, res) => {
  try {
    const { nombre } = req.params;

    const query = `
      MATCH (p:Pais {nombre: $nombre})
      DELETE p
    `;
    const result = await session.run(query, { nombre });

    if (result.summary.counters.updates().nodesDeleted === 0) {
      return res.status(404).send({ error: 'País no encontrado' });
    }

    res.status(200).send({ message: 'País eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el país:', error);
    res.status(500).send({ error: 'Error interno del servidor' });
  }
};


module.exports ={
    createPais,
    getAllPaises,
    getPaisByNombre,
    updatePais,
    deletePais
}