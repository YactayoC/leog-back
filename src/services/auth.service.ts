import { Request, Response } from "express";
import { pool } from "../database/connectionDB";
import { RowDataPacket } from "mysql2";
import bcrypt from "bcrypt";

const iniciarSesion = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Invalid body" });
  }

  try {
    const query = "SELECT * FROM usuarios WHERE email = ?";

    const [response] = await pool.query<RowDataPacket[]>(query, [email]);

    if (response.length === 0) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    const user = response[0];

    const isPasswordValid = await bcrypt.compare(password, user.contrasena);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    return res.json({ message: "Usuario autenticado correctamente" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const registrarUsuario = async (req: Request, res: Response) => {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ message: "Invalid body" });
  }

  try {
    const query = "SELECT * FROM usuarios WHERE email = ?";

    const [response] = await pool.query<RowDataPacket[]>(query, [email]);

    if (response.length > 0) {
      return res.status(400).json({ message: "Usuario ya existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO usuarios (nombre, email, contrasena, rol_id) VALUES (?, ?, ?, 3)",
      [nombre, email, hashedPassword]
    );

    return res.json({ message: "Usuario registrado correctamente" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { iniciarSesion, registrarUsuario };
