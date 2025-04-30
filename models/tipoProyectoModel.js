import  pool  from '../config/connection.js';

// Crear tipo de proyecto
export async function crearTipoProyecto(nombre, descripcion) {
  const result = await pool.query(
    `INSERT INTO Tipo_Proyecto (nombre, descripcion)
     VALUES ($1, $2) RETURNING *`,
    [nombre, descripcion]
  );
  return result.rows[0];
}

// Obtener todos los tipos de proyecto
export async function obtenerTiposProyecto() {
  const result = await pool.query(`SELECT * FROM Tipo_Proyecto`);
  return result.rows;
}

// Obtener un tipo de proyecto por ID
export async function obtenerTipoProyectoPorId(id) {
  const result = await pool.query(`SELECT * FROM Tipo_Proyecto WHERE id = $1`, [id]);
  return result.rows[0];
}

// Actualizar un tipo de proyecto
export async function actualizarTipoProyecto(id, nombre, descripcion) {
  const result = await pool.query(
    `UPDATE Tipo_Proyecto
     SET nombre = $1, descripcion = $2
     WHERE id = $3
     RETURNING *`,
    [nombre, descripcion, id]
  );
  return result.rows[0];
}

// Eliminar un tipo de proyecto
export async function eliminarTipoProyecto(id) {
  const result = await pool.query(`DELETE FROM Tipo_Proyecto WHERE id = $1 RETURNING *`, [id]);
  return result.rows[0];
}
