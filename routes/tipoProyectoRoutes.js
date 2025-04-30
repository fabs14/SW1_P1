import express from 'express';
import {
  crearTipoProyectoController,
  obtenerTiposProyectoController,
  obtenerTipoProyectoPorIdController,
  actualizarTipoProyectoController,
  eliminarTipoProyectoController
} from '../controllers/tipoProyectoController.js';

const router = express.Router();

// Rutas para tipo de proyecto
router.post('/', crearTipoProyectoController);
router.get('/', obtenerTiposProyectoController);
router.get('/:id', obtenerTipoProyectoPorIdController);
router.put('/:id', actualizarTipoProyectoController);
router.delete('/:id', eliminarTipoProyectoController);

export default router;
