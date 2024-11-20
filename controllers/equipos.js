const Equipo = require('../models/equipo');
const Futbolista = require('../models/futbolista');
const Contratacion = require('../models/contratacion');

// Obtener todos los equipos
const obtenerEquipos = async (req, res) => {
    try {
        const equipos = await Equipo.find();
        res.json(equipos);
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener equipos', error });
    }
};

// Crear un equipo
const crearEquipo = async (req, res) => {
    try {
        const { nombre_equipo, pais } = req.body;

        // Verificar si el equipo ya existe
        const equipoExiste = await Equipo.findOne({ nombre_equipo });
        if (equipoExiste) {
            return res.status(400).json({ msg: 'El equipo ya existe' });
        }

        const nuevoEquipo = new Equipo({ nombre_equipo, pais });
        await nuevoEquipo.save();
        res.status(201).json(nuevoEquipo);
    } catch (error) {
        res.status(500).json({ msg: 'Error al crear el equipo', error });
    }
};

// Actualizar un equipo
const actualizarEquipo = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre_equipo, pais } = req.body;

        const equipoActualizado = await Equipo.findByIdAndUpdate(id, { nombre_equipo, pais }, { new: true });

        if (!equipoActualizado) {
            return res.status(404).json({ msg: 'Equipo no encontrado' });
        }

        res.json(equipoActualizado);
    } catch (error) {
        res.status(500).json({ msg: 'Error al actualizar equipo', error });
    }
};

// Eliminar un equipo
const eliminarEquipo = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar si el equipo tiene jugadores asociados
        const jugadores = await Futbolista.find({ equipo: id });
        if (jugadores.length > 0) {
            return res.status(400).json({ msg: 'El equipo no puede ser eliminado porque tiene jugadores asociados' });
        }

        // Verificar si el equipo tiene contratos asociados
        const contratos = await Contratacion.find({ equipo: id });
        if (contratos.length > 0) {
            return res.status(400).json({ msg: 'El equipo no puede ser eliminado porque tiene contratos asociados' });
        }

        // Eliminar el equipo
        const equipoEliminado = await Equipo.findByIdAndDelete(id);
        if (!equipoEliminado) {
            return res.status(404).json({ msg: 'Equipo no encontrado' });
        }

        res.json({ msg: 'Equipo eliminado' });
    } catch (error) {
        res.status(500).json({ msg: 'Error al eliminar equipo', error });
    }
};


// Obtener todos los futbolistas de un equipo específico
const obtenerFutbolistasDeEquipo = async (req, res) => {
    const { idEquipo } = req.params;
  
    try {
      // Verificar si el equipo existe
      const equipoExiste = await Equipo.findById(idEquipo);
      if (!equipoExiste) {
        return res.status(404).json({
          msg: 'Equipo no encontrado'
        });
      }
  
      // Buscar todos los futbolistas que pertenecen a este equipo
      const futbolistas = await Futbolista.find({ equipo: idEquipo })
        .populate('equipo', 'nombre_equipo');  // Poblar el nombre del equipo
  
      res.json(futbolistas);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        msg: 'Error al obtener los futbolistas del equipo'
      });
    }
  };

module.exports = {
    obtenerEquipos,
    crearEquipo,
    actualizarEquipo,
    eliminarEquipo,
    obtenerFutbolistasDeEquipo
};
