const Contratacion = require('../models/contratacion');
const Futbolista = require('../models/futbolista');
const Equipo = require('../models/equipo');

// Crear una nueva contratación
const crearContratacion = async (req, res) => {
  const { futbolista, equipo, fecha_inicio, fecha_fin } = req.body;

  try {
    // Verificar si el futbolista existe
    const futbolistaExiste = await Futbolista.findById(futbolista);
    if (!futbolistaExiste) {
      return res.status(404).json({
        msg: 'Futbolista no encontrado'
      });
    }

    // Verificar si el equipo existe
    const equipoExiste = await Equipo.findById(equipo);
    if (!equipoExiste) {
      return res.status(404).json({
        msg: 'Equipo no encontrado'
      });
    }

    // Verificar si el futbolista ya tiene un contrato activo en el equipo en el mismo período
    const contratoExistente = await Contratacion.findOne({
      futbolista,
      equipo,
      $or: [
        { 
          fecha_inicio: { $lte: fecha_fin }, // Se solapa con una fecha de inicio antes o igual que la fecha de fin del nuevo contrato
          fecha_fin: { $gte: fecha_inicio }   // Se solapa con una fecha de fin después o igual que la fecha de inicio del nuevo contrato
        }
      ]
    });

    if (contratoExistente) {
      return res.status(400).json({
        msg: 'El futbolista ya tiene un contrato activo en este equipo para este período'
      });
    }

    // Crear nueva contratación
    const nuevaContratacion = new Contratacion({ futbolista, equipo, fecha_inicio, fecha_fin });
    await nuevaContratacion.save();

    // Asignar el equipo al futbolista
    futbolistaExiste.equipo = equipo;
    await futbolistaExiste.save();

    res.status(201).json({
      msg: 'Contratación creada con éxito y equipo asignado al futbolista',
      nuevaContratacion
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: 'Error al crear la contratación'
    });
  }
};


const obtenerContrataciones = async (req, res) => {
  try {
    const contrataciones = await Contratacion.find()
      .populate('futbolista', 'nombres apellidos')  // Poblar los datos del futbolista
      .populate('equipo', 'nombre_equipo');         // Poblar los datos del equipo

    res.json(contrataciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: 'Error al obtener las contrataciones'
    });
  }
};

// Actualizar una contratación
const actualizarContratacion = async (req, res) => {
  const { id } = req.params;
  const { futbolista, equipo, ...campos } = req.body;  // Excluir futbolista y equipo si no se están actualizando

  try {
    // Verificar si la contratación existe
    const contratacionExiste = await Contratacion.findById(id);
    if (!contratacionExiste) {
      return res.status(404).json({
        msg: 'Contratación no encontrada'
      });
    }

    // Validar si el equipo o futbolista están siendo cambiados
    if (futbolista) {
      const futbolistaExiste = await Futbolista.findById(futbolista);
      if (!futbolistaExiste) {
        return res.status(404).json({
          msg: 'Futbolista no encontrado'
        });
      }
      campos.futbolista = futbolista;
    }

    if (equipo) {
      const equipoExiste = await Equipo.findById(equipo);
      if (!equipoExiste) {
        return res.status(404).json({
          msg: 'Equipo no encontrado'
        });
      }
      campos.equipo = equipo;
    }

    // Actualizar la contratación
    const contratacionActualizada = await Contratacion.findByIdAndUpdate(id, campos, { new: true });

    res.json({
      msg: 'Contratación actualizada con éxito',
      contratacionActualizada
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: 'Error al actualizar la contratación'
    });
  }
};

// Eliminar una contratación
const eliminarContratacion = async (req, res) => {
  const { id } = req.params;

  try {
    // Verificar si la contratación existe
    const contratacionExiste = await Contratacion.findById(id);
    if (!contratacionExiste) {
      return res.status(404).json({
        msg: 'Contratación no encontrada'
      });
    }

    // Eliminar la contratación
    await Contratacion.findByIdAndDelete(id);

    res.json({
      msg: 'Contratación eliminada con éxito'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: 'Error al eliminar la contratación'
    });
  }
};

// Obtener contrataciones de un futbolista específico
const obtenerContratacionesPorFutbolista = async (req, res) => {
    const { idFutbolista } = req.params;
  
    try {
      // Verificar si el futbolista existe
      const futbolistaExiste = await Futbolista.findById(idFutbolista);
      if (!futbolistaExiste) {
        return res.status(404).json({
          msg: 'Futbolista no encontrado'
        });
      }
  
      // Obtener todas las contrataciones del futbolista
      const contrataciones = await Contratacion.find({ futbolista: idFutbolista })
        .populate('equipo', 'nombre_equipo') // Poblar el equipo relacionado
        .populate('futbolista', 'nombres apellidos'); // Poblar los datos del futbolista
  
      res.json(contrataciones);
      
    } catch (error) {
      console.error(error);
      res.status(500).json({
        msg: 'Error al obtener las contrataciones del futbolista'
      });
    }
  };
  

module.exports = {
  crearContratacion,
  obtenerContrataciones,
  actualizarContratacion,
  eliminarContratacion,
  obtenerContratacionesPorFutbolista
};
