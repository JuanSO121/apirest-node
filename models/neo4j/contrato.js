const { getSession } = require('../../database/Neo4jConnection');
const session = getSession();

const crearContrato = async (req, res) => {
    const {
      jugador, // UUID del jugador
      equipo, // Nombre del equipo
      fecha_inicio,
      fecha_fin,
      salario,
      bonos,
      tipo_contrato,
      condiciones_especiales,
    } = req.body;
  
    if (!jugador || !equipo || !fecha_inicio || !fecha_fin || !salario || !tipo_contrato) {
      return res.status(400).send({ error: 'Faltan campos obligatorios.' });
    }
  
    const session = getSession();
    const tx = session.beginTransaction();
  
    try {
      // Validar si el jugador existe
      const jugadorQuery = `MATCH (j:Jugador {id: $jugador}) RETURN j`;
      const jugadorResult = await tx.run(jugadorQuery, { jugador });
  
      if (jugadorResult.records.length === 0) {
        await tx.rollback();
        return res.status(404).send({ error: 'Jugador no encontrado.' });
      }
  
      // Validar si el equipo existe
      const equipoQuery = `MATCH (e:Equipo {nombre: $equipo}) RETURN e`;
      const equipoResult = await tx.run(equipoQuery, { equipo });
  
      if (equipoResult.records.length === 0) {
        await tx.rollback();
        return res.status(404).send({ error: 'Equipo no encontrado.' });
      }
  
      // Crear el contrato
      const contratoQuery = `
        MATCH (j:Jugador {id: $jugador}), (e:Equipo {nombre: $equipo})
        CREATE (j)-[:TIENE_CONTRATO {
          salario: $salario,
          bonos: $bonos,
          tipo_contrato: $tipo_contrato,
          condiciones_especiales: $condiciones_especiales,
          inicio: $fecha_inicio,
          fin: $fecha_fin
        }]->(e)
      `;
      await tx.run(contratoQuery, {
        jugador,
        equipo,
        salario,
        bonos: bonos || 0,
        tipo_contrato,
        condiciones_especiales: condiciones_especiales || '',
        fecha_inicio,
        fecha_fin,
      });
  
      await tx.commit();
      res.status(201).send({ message: 'Contrato creado exitosamente.' });
    } catch (error) {
      console.error('Error al crear contrato:', error);
      await tx.rollback();
      res.status(500).send({ error: 'Error interno del servidor.' });
    } finally {
      await session.close();
    }
  };
  
  

  const obtenerContratos = async (req, res) => {
    const session = getSession();
  
    try {
      const query = `
        MATCH (j:Jugador)-[c:TIENE_CONTRATO]->(e:Equipo)
        RETURN j, c, e
      `;
      const result = await session.run(query);
  
      const contratos = result.records.map(record => ({
        jugador: record.get('j').properties,
        contrato: record.get('c').properties,
        equipo: record.get('e').properties,
      }));
  
      res.status(200).send({ data: contratos });
    } catch (error) {
      console.error('Error al obtener contratos:', error);
      res.status(500).send({ error: 'Error interno del servidor.' });
    } finally {
      await session.close();
    }
  };

  const actualizarContrato = async (req, res) => {
    const { jugador, equipo } = req.params;
    const {
      salario,
      bonos,
      tipo_contrato,
      condiciones_especiales,
      fecha_inicio,
      fecha_fin,
    } = req.body;
  
    if (!salario || !fecha_inicio || !fecha_fin) {
      return res.status(400).send({ error: 'Campos obligatorios faltantes.' });
    }
  
    const session = getSession();
  
    try {
      const query = `
        MATCH (j:Jugador {id: $jugador})-[c:TIENE_CONTRATO]->(e:Equipo {nombre: $equipo})
        SET c.salario = $salario,
            c.bonos = $bonos,
            c.tipo_contrato = $tipo_contrato,
            c.condiciones_especiales = $condiciones_especiales,
            c.inicio = $fecha_inicio,
            c.fin = $fecha_fin
        RETURN c
      `;
      const result = await session.run(query, {
        jugador,
        equipo,
        salario,
        bonos: bonos || 0,
        tipo_contrato,
        condiciones_especiales: condiciones_especiales || '',
        fecha_inicio,
        fecha_fin,
      });
  
      if (result.records.length === 0) {
        return res.status(404).send({ error: 'Contrato no encontrado.' });
      }
  
      res.status(200).send({ message: 'Contrato actualizado correctamente.' });
    } catch (error) {
      console.error('Error al actualizar contrato:', error);
      res.status(500).send({ error: 'Error interno del servidor.' });
    } finally {
      await session.close();
    }
  };
  
  

  const eliminarContrato = async (req, res) => {
    const { jugador, equipo } = req.params;
    const session = getSession();
  
    try {
      const query = `
        MATCH (j:Jugador {id: $jugador})-[c:TIENE_CONTRATO]->(e:Equipo {nombre: $equipo})
        DELETE c
      `;
      const result = await session.run(query, { jugador, equipo });
  
      if (result.summary.counters.updates().relationshipsDeleted === 0) {
        return res.status(404).send({ error: 'Contrato no encontrado.' });
      }
  
      res.status(200).send({ message: 'Contrato eliminado correctamente.' });
    } catch (error) {
      console.error('Error al eliminar contrato:', error);
      res.status(500).send({ error: 'Error interno del servidor.' });
    } finally {
      await session.close();
    }
  };
  

module.exports = {
  crearContrato,
  obtenerContratos,
  actualizarContrato,
  eliminarContrato,
};