const { getSession } = require('../../database/Neo4jConnection');
const { v4: uuidv4 } = require('uuid'); // Para generar IDs únicos

const session = getSession();

// Crear un jugador con la relación JUEGA_EN y fecha_vinculacion
const crearJugador = async (req, res) => {
    const {
      nombre,
      edad,
      nacionalidad,
      sexo,
      fechaNacimiento,
      ciudadNacimiento,
      equipo,
      fecha_vinculacion,
    } = req.body;
  
    // Validación de entrada
    if (
      !nombre ||
      !edad ||
      !nacionalidad ||
      !sexo ||
      !fechaNacimiento ||
      !ciudadNacimiento ||
      !equipo ||
      !fecha_vinculacion
    ) {
      return res.status(400).send({ error: 'Faltan campos obligatorios.' });
    }
  
    if (!/^[a-zA-Z ]+$/.test(nombre)) {
      return res
        .status(400)
        .send({ error: 'El nombre solo debe contener letras y espacios.' });
    }
  
    if (!Number.isInteger(edad) || edad <= 0) {
      return res.status(400).send({ error: 'La edad debe ser un número entero positivo.' });
    }
  
    const session = getSession();
    const tx = session.beginTransaction();
  
    try {
      // Verificar si el equipo existe
      const checkEquipoQuery = `
        MATCH (e:Equipo {nombre: $equipo})
        RETURN e
      `;
      const equipoResult = await tx.run(checkEquipoQuery, { equipo });
  
      if (equipoResult.records.length === 0) {
        await tx.rollback();
        return res
          .status(400)
          .send({ error: 'El equipo especificado no existe. Debe ser creado previamente.' });
      }
      const existingEquipo = equipoResult.records[0].get('e').properties;
  
      // Generar un ID único para el jugador
      const jugadorId = uuidv4();
  
      // Crear el nodo Jugador con las nuevas propiedades
      const createJugadorQuery = `
        CREATE (j:Jugador {
          id: $id,
          nombre: $nombre,
          edad: $edad,
          nacionalidad: $nacionalidad,
          sexo: $sexo,
          fechaNacimiento: $fechaNacimiento,
          ciudadNacimiento: $ciudadNacimiento
        })
        RETURN j
      `;
      const newJugadorResult = await tx.run(createJugadorQuery, {
        id: jugadorId,
        nombre,
        edad,
        nacionalidad,
        sexo,
        fechaNacimiento,
        ciudadNacimiento,
      });
      const createdJugador = newJugadorResult.records[0].get('j').properties;
  
      // Crear la relación entre Jugador y Equipo con fecha de vinculación
      const createRelationQuery = `
        MATCH (j:Jugador {id: $id}), (e:Equipo {nombre: $equipo})
        MERGE (j)-[r:JUEGA_EN {fecha_vinculacion: $fecha_vinculacion}]->(e)
        RETURN j, e, r
      `;
      const relationResult = await tx.run(createRelationQuery, {
        id: jugadorId,
        equipo,
        fecha_vinculacion,
      });
  
      await tx.commit();
  
      const createdRelation = relationResult.records[0].get('r').properties;
  
      res.status(201).send({
        message: 'Jugador creado correctamente con relación al equipo.',
        data: {
          jugador: createdJugador,
          equipo: existingEquipo,
          relacion: createdRelation,
        },
      });
    } catch (error) {
      console.error('Error al crear el jugador:', error);
      await tx.rollback();
      res.status(500).send({ error: 'Error interno del servidor.' });
    } finally {
      await session.close();
    }
  };

// Obtener todos los jugadores
const getAllJugadores = async (req, res) => {
  try {
    const query = `MATCH (j:Jugador) RETURN j`;
    const result = await session.run(query);

    const jugadores = result.records.map(record => record.get('j').properties);
    res.status(200).send({ data: jugadores });
  } catch (error) {
    console.error('Error al obtener jugadores:', error);
    res.status(500).send({ error: 'Error interno del servidor' });
  } finally {
    session.close();
  }
};

// Actualizar un jugador
const updateJugador = async (req, res) => {
  const { nombre: nombreParam } = req.params;
  const { nombre, edad, nacionalidad } = req.body;
  try {
    if (!nombre && !edad && !nacionalidad) {
      return res.status(400).send({ error: 'Se requiere al menos un campo para actualizar.' });
    }

    const query = `
      MATCH (j:Jugador {nombre: $nombreParam})
      SET j.nombre = COALESCE($nombre, j.nombre),
          j.edad = COALESCE($edad, j.edad),
          j.nacionalidad = COALESCE($nacionalidad, j.nacionalidad)
      RETURN j
    `;
    const result = await session.run(query, { nombreParam, nombre, edad, nacionalidad });

    if (result.records.length === 0) {
      return res.status(404).send({ error: 'Jugador no encontrado.' });
    }

    const jugadorActualizado = result.records[0].get('j').properties;
    res.status(200).send({ message: 'Jugador actualizado correctamente', data: jugadorActualizado });
  } catch (error) {
    console.error('Error al actualizar el jugador:', error);
    res.status(500).send({ error: 'Error interno del servidor' });
  } finally {
    session.close();
  }
};

// Eliminar un jugador
const eliminarJugador = async (req, res) => {
  const { nombre } = req.params;
  try {
    const deleteQuery = `
      MATCH (j:Jugador {nombre: $nombre})
      DELETE j
    `;
    const result = await session.run(deleteQuery, { nombre });

    if (result.summary.counters.updates().nodesDeleted === 0) {
      return res.status(404).send({ error: 'Jugador no encontrado.' });
    }

    res.status(200).send({ message: 'Jugador eliminado correctamente.' });
  } catch (error) {
    console.error('Error al eliminar el jugador:', error);
    res.status(500).send({ error: 'Error interno del servidor' });
  } finally {
    session.close();
  }
};

module.exports = {
  crearJugador,
  getAllJugadores,
  updateJugador,
  eliminarJugador,
};
