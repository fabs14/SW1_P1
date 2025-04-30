import {
    crearTipoProyecto,
    obtenerTiposProyecto,
    obtenerTipoProyectoPorId,
    actualizarTipoProyecto,
    eliminarTipoProyecto
  } from '../models/tipoProyectoModel.js';
  
  // Crear tipo de proyecto
  export const crearTipoProyectoController = async (req, res) => {
    try {
      const { nombre, descripcion } = req.body;
      const tipoProyecto = await crearTipoProyecto(nombre, descripcion);
      res.status(201).json(tipoProyecto);
    } catch (error) {
      console.error('Error creando tipo de proyecto:', error);
      res.status(500).json({ message: 'Error al crear tipo de proyecto' });
    }
  };
  
  // Obtener todos los tipos de proyecto
  export const obtenerTiposProyectoController = async (req, res) => {
    try {
      const tipos = await obtenerTiposProyecto();
      res.json(tipos);
    } catch (error) {
      console.error('Error obteniendo tipos de proyecto:', error);
      res.status(500).json({ message: 'Error al obtener tipos de proyecto' });
    }
  };
  
  // Obtener tipo de proyecto por id
  export const obtenerTipoProyectoPorIdController = async (req, res) => {
    try {
      const { id } = req.params;
      const tipo = await obtenerTipoProyectoPorId(id);
      if (!tipo) {
        return res.status(404).json({ message: 'Tipo de proyecto no encontrado' });
      }
      res.json(tipo);
    } catch (error) {
      console.error('Error obteniendo tipo de proyecto:', error);
      res.status(500).json({ message: 'Error al obtener tipo de proyecto' });
    }
  };
  
  // Actualizar tipo de proyecto
  export const actualizarTipoProyectoController = async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, descripcion } = req.body;
      const tipo = await actualizarTipoProyecto(id, nombre, descripcion);
      if (!tipo) {
        return res.status(404).json({ message: 'Tipo de proyecto no encontrado para actualizar' });
      }
      res.json(tipo);
    } catch (error) {
      console.error('Error actualizando tipo de proyecto:', error);
      res.status(500).json({ message: 'Error al actualizar tipo de proyecto' });
    }
  };
  
  // Eliminar tipo de proyecto
  export const eliminarTipoProyectoController = async (req, res) => {
    try {
      const { id } = req.params;
      const tipo = await eliminarTipoProyecto(id);
      if (!tipo) {
        return res.status(404).json({ message: 'Tipo de proyecto no encontrado para eliminar' });
      }
      res.json({ message: 'Tipo de proyecto eliminado correctamente' });
    } catch (error) {
      console.error('Error eliminando tipo de proyecto:', error);
      res.status(500).json({ message: 'Error al eliminar tipo de proyecto' });
    }
  };
  