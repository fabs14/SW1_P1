import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import proyectosRoutes from './routes/proyectosRoutes.js';
import tipoProyectoRoutes from './routes/tipoProyectoRoutes.js';
import exportAngularRoutes from './routes/exportAngularRoutes.js';
import exportAngularFromImageRoutes from './routes/exportImageRoutes.js';
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/proyectos', proyectosRoutes);
app.use('/api/tipos-proyecto', tipoProyectoRoutes);
app.use('/api/export-angular', exportAngularRoutes);
app.use('/api/export-angular-from-image', exportAngularFromImageRoutes);
export default app;
