import express from 'express';
import {
  crearProyectoController,
  obtenerProyectosController,
  obtenerProyectoPorIdController,
  actualizarProyectoController,
  eliminarProyectoController,
  invitarAProyectoController, // <-- asegúrate que esté importado
} from '../controllers/proyectosController.js';

import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// 📦 Tus rutas actuales
router.post('/', protect, crearProyectoController);
router.get('/', protect, obtenerProyectosController);
router.get('/:id', protect, obtenerProyectoPorIdController);
router.put('/:id', protect, actualizarProyectoController);
router.delete('/:id', protect, eliminarProyectoController);

// 📦 🚀 NUEVA RUTA PARA INVITAR
router.post('/:id/invitar', protect, invitarAProyectoController); 

export default router;
