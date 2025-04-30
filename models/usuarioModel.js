import pool from '../config/connection.js';

export const createUser = async (nombre, correo, password) => {
  const result = await pool.query(
    'INSERT INTO Usuario (nombre, correo, password	) VALUES ($1, $2, $3) RETURNING *',
    [nombre, correo, password] 
  );
  return result.rows[0];
};

export const findUserByEmail = async (correo) => {
  const result = await pool.query(
    'SELECT * FROM Usuario WHERE correo = $1',
    [correo]
  );
  return result.rows[0];
};

export const findUserById = async (id) => {
  const result = await pool.query(
    'SELECT * FROM Usuario WHERE id = $1',
    [id]
  );
  return result.rows[0];
};
