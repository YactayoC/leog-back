import { RowDataPacket } from "mysql2";
import { pool } from "../database/connectionDB";
import bcrypt from "bcrypt";

export const verificarRegistro = async () => {
  try {
    const query =
      "SELECT COUNT(*) AS count FROM usuarios WHERE email = 'admin@admin.com'";

    const [resultado] = await pool.query<RowDataPacket[]>(query);
    console.log("Verficando el registro por defecto.")

    if (resultado.length === 0) {
      await insertarRegistroPorDefecto();
      return;
    }

    console.log("Registro por defecto ya existe.")

    return;
  } catch (error) {
    console.error("Error al verificar el registro:", error);
  }
};

const insertarRegistroPorDefecto = async () => {
  try {
    const contrasenaClean = "admin123";
    const contrasenaEncrypt = await bcrypt.hash(contrasenaClean, 10);
    const query =
      "INSERT INTO usuarios (nombre, email, contrasena, rol_id) VALUES ('Admin', 'admin@admin.com', ?, 1)";
    await pool.query(query, [contrasenaEncrypt]); // Reemplaza con los valores deseados
    console.log("Registro por defecto insertado correctamente.");
  } catch (error) {
    console.error("Error al insertar el registro por defecto:", error);
  }
};
