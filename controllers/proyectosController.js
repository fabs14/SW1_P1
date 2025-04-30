import {
    crearProyectoConUsuario,
    obtenerProyectosPorUsuario,
    obtenerProyectoPorId,
    actualizarProyecto,
    eliminarProyecto
  } from '../models/proyectosModel.js';
  import { asignarProyectoAUsuario } from '../models/proyectosModel.js';

  // Crear proyecto asociado al usuario
export const crearProyectoController = async (req, res) => {
    try {
      const { nombre_proyecto, data, tipo_proyecto_id } = req.body;
      const usuarioId = req.usuarioId; // <-- Traído del middleware
  
      const proyecto = await crearProyectoConUsuario(nombre_proyecto, data, tipo_proyecto_id, usuarioId);
  
      res.status(201).json(proyecto);
    } catch (error) {
      console.error('Error creando proyecto:', error);
      res.status(500).json({ message: 'Error al crear proyecto' });
    }
  };
  
  // Obtener todos los proyectos del usuario
  export const obtenerProyectosController = async (req, res) => {
    try {
      const usuarioId = req.usuarioId; // <-- Traído del middleware
  
      const proyectos = await obtenerProyectosPorUsuario(usuarioId);
  
      res.json(proyectos);
    } catch (error) {
      console.error('Error obteniendo proyectos:', error);
      res.status(500).json({ message: 'Error al obtener proyectos' });
    }
  };
  
  // Obtener un proyecto por id
  export const obtenerProyectoPorIdController = async (req, res) => {
    try {
      const { id } = req.params;
      const proyecto = await obtenerProyectoPorId(id);
      if (!proyecto) {
        return res.status(404).json({ message: 'Proyecto no encontrado' });
      }
      res.json(proyecto);
    } catch (error) {
      console.error('Error obteniendo proyecto:', error);
      res.status(500).json({ message: 'Error al obtener proyecto' });
    }
  };
  
  // Actualizar proyecto
  export const actualizarProyectoController = async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre_proyecto, data, tipo_proyecto_id } = req.body;
      const proyecto = await actualizarProyecto(id, nombre_proyecto, data, tipo_proyecto_id);
      if (!proyecto) {
        return res.status(404).json({ message: 'Proyecto no encontrado para actualizar' });
      }
      res.json(proyecto);
    } catch (error) {
      console.error('Error actualizando proyecto:', error);
      res.status(500).json({ message: 'Error al actualizar proyecto' });
    }
  };
  
  // Eliminar proyecto
  export const eliminarProyectoController = async (req, res) => {
    try {
      const { id } = req.params;
      const proyecto = await eliminarProyecto(id);
      if (!proyecto) {
        return res.status(404).json({ message: 'Proyecto no encontrado para eliminar' });
      }
      res.json({ message: 'Proyecto eliminado correctamente' });
    } catch (error) {
      console.error('Error eliminando proyecto:', error);
      res.status(500).json({ message: 'Error al eliminar proyecto' });
    }
  };
  
  export const invitarAProyectoController = async (req, res) => {
    try {
      const { id } = req.params; // ID del proyecto
      const { usuario_id } = req.body; // ⬅️ ID del usuario a invitar
  
      console.log("ID del proyecto:", id);
      console.log("ID del usuario a invitar:", usuario_id);
  
      const resultado = await asignarProyectoAUsuario(id,usuario_id); // Ojo el orden
  
      res.status(200).json({ message: 'Proyecto asignado correctamente' });
    } catch (error) {
      console.error('Error invitando a proyecto:', error);
      res.status(500).json({ message: 'Error al invitar a proyecto' });
    }
  };
  