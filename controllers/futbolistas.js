const Futbolista = require('../models/futbolista');
const Contratacion = require('../models/contratacion');
const Equipo = require('../models/equipo');

// Obtener todos los futbolistas (con sus equipos)
const obtenerFutbolistas = async (req, res) => {
    try {
        const futbolistas = await Futbolista.find().populate('equipo');
        res.json(futbolistas);
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener futbolistas', error });
    }
};

// Crear un futbolista
const crearFutbolista = async (req, res) => {
    const { nombres, apellidos, fecha_nacimiento, equipo, edad } = req.body;

    try {
        let equipoExiste = null;
        let contratoActivo = null;

        // Si se proporciona un equipo, realiza las verificaciones
        if (equipo) {
            // Verificar si el equipo existe
            equipoExiste = await Equipo.findById(equipo);
            if (!equipoExiste) {
                return res.status(404).json({
                    msg: 'Equipo no encontrado'
                });
            }

            // Verificar contratación activa en el equipo
            const hoy = new Date();
            contratoActivo = await Contratacion.findOne({
                futbolista: req.body.futbolistaId,
                equipo,
                fecha_inicio: { $lte: hoy },
                fecha_fin: { $gte: hoy }
            });

            if (!contratoActivo) {
                return res.status(400).json({
                    msg: 'El futbolista no puede ser asignado a este equipo sin una contratación activa.'
                });
            }
        }

        // Crear nuevo futbolista con o sin equipo
        const nuevoFutbolista = new Futbolista({
            nombres,
            apellidos,
            fecha_nacimiento,
            equipo: equipoExiste ? equipoExiste._id : null, // Asigna null si no hay equipo
            edad
        });

        await nuevoFutbolista.save();

        res.status(201).json({
            msg: 'Futbolista creado con éxito',
            nuevoFutbolista
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error al crear el futbolista'
        });
    }
};


// Actualizar un futbolista
const actualizarFutbolista = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombres, apellidos, fecha_nacimiento, edad, equipo } = req.body;

        // Validar que el equipo existe
        const equipoExiste = await Equipo.findById(equipo);
        if (!equipoExiste) {
            return res.status(400).json({ msg: 'El equipo no existe' });
        }

        const futbolistaActualizado = await Futbolista.findByIdAndUpdate(id, { nombres, apellidos, fecha_nacimiento, edad, equipo }, { new: true });

        if (!futbolistaActualizado) {
            return res.status(404).json({ msg: 'Futbolista no encontrado' });
        }

        res.json(futbolistaActualizado);
    } catch (error) {
        res.status(500).json({ msg: 'Error al actualizar futbolista', error });
    }
};

// Eliminar un futbolista
const eliminarFutbolista = async (req, res) => {
  try {
      const { id } = req.params;

      // Verificar si el futbolista tiene contratos activos
      const tieneContratos = await Contratacion.findOne({ futbolista: id });
      if (tieneContratos) {
          return res.status(400).json({ msg: 'No se puede eliminar el futbolista porque tiene contratos activos' });
      }

      // Verificar si el futbolista está en un equipo
      const perteneceAEquipo = await Equipo.findOne({ futbolistas: id });
      if (perteneceAEquipo) {
          return res.status(400).json({ msg: 'No se puede eliminar el futbolista porque pertenece a un equipo' });
      }

      // Si no tiene contratos ni pertenece a un equipo, proceder a la eliminación
      const futbolistaEliminado = await Futbolista.findByIdAndDelete(id);
      if (!futbolistaEliminado) {
          return res.status(404).json({ msg: 'Futbolista no encontrado' });
      }

      res.json({ msg: 'Futbolista eliminado' });
  } catch (error) {
      res.status(500).json({ msg: 'Error al eliminar futbolista', error });
  }
};

const obtenerEquiposPorFutbolista = async (req, res) => {
  const { idFutbolista } = req.params;

  try {
      // Verificar si el futbolista existe
      const futbolistaExiste = await Futbolista.findById(idFutbolista);
      if (!futbolistaExiste) {
          return res.status(404).json({
              msg: 'Futbolista no encontrado'
          });
      }

      // Obtener todas las contrataciones del futbolista y poblar los equipos
      const contrataciones = await Contratacion.find({ futbolista: idFutbolista })
          .populate('equipo', 'nombre_equipo'); // Poblar los equipos asociados

      // Extraer solo los equipos de las contrataciones
      const equipos = contrataciones.map(contrato => contrato.equipo);

      res.json(equipos);
  } catch (error) {
      console.error(error);
      res.status(500).json({
          msg: 'Error al obtener los equipos del futbolista'
      });
  }
};

const obtenerFutbolistaPorId = async (req, res) => {
    const { id } = req.params;

    try {
        // Buscar el futbolista por ObjectId y poblar el equipo
        const futbolista = await Futbolista.findById(id).populate('equipo', 'nombre_equipo');
        
        if (!futbolista) {
            return res.status(404).json({ msg: 'Futbolista no encontrado' });
        }

        // Buscar todos los contratos del futbolista y poblar el equipo y detalles del futbolista
        const contratos = await Contratacion.find({ futbolista: id })
            .populate('equipo', 'nombre_equipo')

        res.json({
            futbolista,
            contratos
        });
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener el futbolista', error });
    }
};


module.exports = {
    obtenerFutbolistas,
    obtenerFutbolistaPorId,
    crearFutbolista,
    actualizarFutbolista,
    eliminarFutbolista,
    obtenerEquiposPorFutbolista
};
