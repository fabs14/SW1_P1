import  pool  from '../config/connection.js';
import { v4 as uuidv4 } from 'uuid';



// Crear un proyecto y asociarlo a un usuario
export async function crearProyectoConUsuario(nombre_proyecto, data, tipo_proyecto_id, usuario_id) {
    const proyectoId = uuidv4();
    const usuarioProyectoId = uuidv4();
  
    // Crear el proyecto
    await pool.query(
      `INSERT INTO Proyectos (id, nombre_proyecto, data, tipo_proyecto_id)
       VALUES ($1, $2, $3, $4)`,
      [proyectoId, nombre_proyecto, data, tipo_proyecto_id]
    );
  
    // Asociar al usuario
    await pool.query(
      `INSERT INTO Usuario_Proyectos (id, usuario_id, proyecto_id)
       VALUES ($1, $2, $3)`,
      [usuarioProyectoId, usuario_id, proyectoId]
    );
  
    // Retornar solo el ID y nombre del proyecto creado
    return { id: proyectoId, nombre_proyecto };
  }


// Obtener todos los proyectos de un usuario
export async function obtenerProyectosPorUsuario(usuario_id) {
    const result = await pool.query(`
      SELECT p.id, p.nombre_proyecto, p.fechaCreacion
      FROM Proyectos p
      INNER JOIN Usuario_Proyectos up ON up.proyecto_id = p.id
      WHERE up.usuario_id = $1
    `, [usuario_id]);
  
    return result.rows;
  }
  
// Obtener un solo proyecto por ID
export async function obtenerProyectoPorId(id) {
  const result = await pool.query(`SELECT * FROM Proyectos WHERE id = $1`, [id]);
  return result.rows[0];
}

// Actualizar un proyecto
export async function actualizarProyecto(id, nombre_proyecto, data, tipo_proyecto_id = null) {
  const result = await pool.query(
    `UPDATE Proyectos
     SET nombre_proyecto = $1, data = $2, tipo_proyecto_id = $3, fechaCreacion = CURRENT_TIMESTAMP
     WHERE id = $4
     RETURNING *`,
    [nombre_proyecto, data, tipo_proyecto_id, id]
  );
  return result.rows[0];
}

// Eliminar un proyecto
export async function eliminarProyecto(id) {
  const result = await pool.query(`DELETE FROM Proyectos WHERE id = $1 RETURNING *`, [id]);
  return result.rows[0];
}
// 🚀 Nuevo método: Asignar proyecto a un usuario
export async function asignarProyectoAUsuario(proyectoId, usuarioId) {
  // ✅ Verificar si ya está asignado
  const existe = await pool.query(
    `SELECT 1 FROM usuario_proyectos WHERE usuario_id = $1 AND proyecto_id = $2`,
    [usuarioId, proyectoId]
  );

  if (existe.rowCount > 0) return null;

  const result = await pool.query(
    `INSERT INTO usuario_proyectos (id, usuario_id, proyecto_id)
     VALUES (gen_random_uuid(), $1, $2)`,
    [usuarioId, proyectoId]
  );

  return result.rows[0];
}

