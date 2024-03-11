import { Request, Response } from "express";
import { pool } from "../database/connectionDB";

const listarCategorias = async (req: Request, res: Response) => {
  try {
    const [result] = await pool.query("SELECT * FROM categorias");
    return res.json({ categorias: result });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const agregarCategoria = async (req: Request, res: Response) => {
  const { nombre, descripcion } = req.body;

  if (!nombre || !descripcion) {
    return res.status(400).json({ message: "Invalid body" });
  }

  try {
    await pool.query("CALL agregar_categoria(?, ?)", [nombre, descripcion]);
    return res.json({ message: "Categoria agregado correctamente" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// FALLTA ACTUALIZAR DE LA CATEGORIA

const eliminarCategoria = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Invalid body" });
  }

  try {
    await pool.query("DELETE FROM cursos WHERE categoria_id = ?", [id]);
    await pool.query("DELETE FROM categorias WHERE id = ?", [id]);
    return res.json({ message: "Categoria eliminado correctamente" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { listarCategorias, agregarCategoria, eliminarCategoria };
