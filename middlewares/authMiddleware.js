import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/jwt.js';
import { findUserById } from '../models/usuarioModel.js';

export const protect = async (req, res, next) => {
  let token = req.headers.authorization;

  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No autorizado' });
  }

  token = token.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const usuario = await findUserById(decoded.id);

    if (!usuario) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    // ⚡ CORRECCIÓN: Guarda solo el ID en la request
    req.usuarioId = decoded.id;
    console.log('Usuario ID:', req.usuarioId); // Para depuración
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};
