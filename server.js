import app from './app.js';
import { createServer } from 'http';
import { Server } from 'socket.io';

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log('✅ Cliente conectado:', socket.id);

  // 🏠 El cliente se une a una sala basada en el ID del proyecto
  socket.on('joinProject', (projectId) => {
    socket.join(projectId);
    console.log(`📂 Socket ${socket.id} se unió al proyecto ${projectId}`);
  });

  // 🔄 Actualización completa del editor (html+css)
  socket.on('editorUpdate', (data) => {
    const { projectId } = data;
    if (!projectId) return;
    socket.to(projectId).emit('editorUpdate', data);
    console.log(`🔄 editorUpdate emitido en sala ${projectId}`);
  });
  socket.on('pagesUpdate', (data) => {
    const { projectId } = data;
    if (!projectId) return;
    socket.to(projectId).emit('pagesUpdate', data);
  });
  
  socket.on('disconnect', () => {
    console.log('❌ Cliente desconectado:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Servidor WebSocket escuchando en el puerto ${PORT}`);
});
