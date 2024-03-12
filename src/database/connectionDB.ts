import { createPool } from "mysql2/promise";

export const pool = createPool({
  host: "localhost",
  user: "root",
  password: "sebas123",
  database: "leog",
});

export const verificateConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Conexión establecida correctamente a la base de datos");
    connection.release();
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
  }
};
