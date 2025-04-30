import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { createUser, findUserByEmail } from '../models/usuarioModel.js';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/jwt.js';

// Generar Token JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Controlador: Registrar nuevo usuario
export const register = async (req, res) => {
  const { nombre, correo, password } = req.body;

  try {
    const userExist = await findUserByEmail(correo);
    if (userExist) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const usuario = await createUser(nombre, correo, hashedPassword);

    const token = generateToken(usuario.id);

    res.status(201).json({ token });
  } catch (error) {
    console.error('Error en register:', error);
    res.status(500).json({ message: 'Error interno en el registro' });
  }
};

// Controlador: Login
export const login = async (req, res) => {
  const { correo, password } = req.body;

  try {
    const usuario = await findUserByEmail(correo);

    if (!usuario) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    const isMatch = await bcrypt.compare(password, usuario.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    const token = generateToken(usuario.id);

    res.json({ token });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error interno en el login' });
  }
};
