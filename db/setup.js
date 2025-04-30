import pool  from '../config/connection.js';

export async function crearTablas() {
  try {

    // Crear nueva tabla Usuario
    await pool.query(`
      CREATE TABLE Usuario (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        nombre VARCHAR(255) NOT NULL,
        correo VARCHAR(255) UNIQUE NOT NULL,
        password TEXT NOT NULL
      );
    `);

    // Crear nueva tabla Tipo_Proyecto
    await pool.query(`
      CREATE TABLE Tipo_Proyecto (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        nombre VARCHAR(255) NOT NULL,
        descripcion TEXT
      );
    `);

    // Crear nueva tabla Proyectos
    await pool.query(`
      CREATE TABLE Proyectos (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        nombre_proyecto VARCHAR(255) NOT NULL,
        data JSONB NOT NULL,
        fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        tipo_proyecto_id UUID,
        FOREIGN KEY (tipo_proyecto_id) REFERENCES Tipo_Proyecto(id)
      );
    `);

    // Crear nueva tabla Usuario_Proyectos
    await pool.query(`
      CREATE TABLE Usuario_Proyectos (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        usuario_id UUID NOT NULL,
        proyecto_id UUID NOT NULL,
        FOREIGN KEY (usuario_id) REFERENCES Usuario(id) ON DELETE CASCADE,
        FOREIGN KEY (proyecto_id) REFERENCES Proyectos(id) ON DELETE CASCADE
      );
    `);

    console.log('✅ Tablas creadas correctamente');

  } catch (error) {
    console.error('❌ Error creando tablas:', error);
  }
}