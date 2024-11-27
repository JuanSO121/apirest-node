const { getSession } = require('../../database/Neo4jConnection');
const { v4: uuidv4 } = require('uuid');

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
  
    // Validar entrada
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
        .send({ error: 'El nombre del jugador solo debe contener letras y espacios.' });
    }
  
    if (!Number.isInteger(edad) || edad <= 0) {
      return res.status(400).send({ error: 'La edad debe ser un número entero positivo.' });
    }
  
    const session = getSession(); // Crear la sesión
    const tx = session.beginTransaction(); // Iniciar transacción
  
    try {
      // Verificar si el equipo existe
      const equipoQuery = `MATCH (e:Equipo {nombre: $equipo}) RETURN e`;
      const equipoResult = await tx.run(equipoQuery, { equipo });
  
      if (equipoResult.records.length === 0) {
        await tx.rollback();
        return res.status(404).send({ error: 'El equipo especificado no existe.' });
      }
  
      // Generar un ID único para el jugador
      const jugadorId = uuidv4();
  
      // Crear el nodo del jugador con las nuevas propiedades
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
      const jugadorResult = await tx.run(createJugadorQuery, {
        id: jugadorId,
        nombre,
        edad,
        nacionalidad,
        sexo,
        fechaNacimiento,
        ciudadNacimiento,
      });
  
      // Crear relación con el equipo
      const createRelationQuery = `
        MATCH (j:Jugador {id: $id}), (e:Equipo {nombre: $equipo})
        MERGE (j)-[:JUEGA_EN {fecha_vinculacion: $fecha_vinculacion}]->(e)
        RETURN j, e
      `;
      await tx.run(createRelationQuery, { id: jugadorId, equipo, fecha_vinculacion });
  
      await tx.commit(); // Confirmar la transacción
  
      res.status(201).send({
        message: 'Jugador creado correctamente con relación al equipo.',
        data: jugadorResult.records[0].get('j').properties,
      });
    } catch (error) {
      console.error('Error al crear el jugador:', error);
      await tx.rollback();
      res.status(500).send({ error: 'Error interno del servidor.' });
    } finally {
      await session.close();
    }
  };
  
  


const obtenerJugadores = async (req, res) => {
    const session = getSession();

    try {
        const query = `
            MATCH (j:Jugador)-[:PERTENECE_A]->(e:Equipo)
            RETURN j, e
        `;
        const result = await session.run(query);

        const jugadores = result.records.map(record => ({
            jugador: record.get('j').properties,
            equipo: record.get('e').properties
        }));

        res.status(200).send({ data: jugadores });
    } catch (error) {
        console.error('Error al obtener jugadores:', error);
        res.status(500).send({ error: 'Error interno del servidor' });
    } finally {
        await session.close(); // Cierra la sesión después de la consulta
    }
};

const actualizarJugador = async (req, res) => {
    const { id } = req.params;
    const { nombre, edad } = req.body;
  
    try {
      const query = `
        MATCH (j:Jugador {id: $id})
        SET j.nombre = COALESCE($nombre, j.nombre),
            j.edad = COALESCE($edad, j.edad)
        RETURN j
      `;
      const result = await session.run(query, { id, nombre, edad });
  
      if (result.records.length === 0) {
        return res.status(404).send({ error: 'Jugador no encontrado.' });
      }
  
      const jugadorActualizado = result.records[0].get('j').properties;
      res.status(200).send({ message: 'Jugador actualizado correctamente', data: jugadorActualizado });
    } catch (error) {
      console.error('Error al actualizar el jugador:', error);
      res.status(500).send({ error: 'Error interno del servidor.' });
    }
  };

const eliminarJugador = async (req, res) => {
  const { id } = req.params;

  try {
    const deleteQuery = `MATCH (j:Jugador {id: $id}) DETACH DELETE j`;
    const result = await session.run(deleteQuery, { id });

    if (result.summary.counters.updates().nodesDeleted === 0) {
      return res.status(404).send({ error: 'Jugador no encontrado.' });
    }

    res.status(200).send({ message: 'Jugador eliminado correctamente.' });
  } catch (error) {
    console.error('Error al eliminar el jugador:', error);
    res.status(500).send({ error: 'Error interno del servidor.' });
  }
};


module.exports = {
    crearJugador,
    obtenerJugadores,
    actualizarJugador,
    eliminarJugador
};
