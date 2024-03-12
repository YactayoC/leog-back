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

const editarCategoria = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;

  if (!id || !nombre || !descripcion) {
    return res.status(400).json({ message: "Invalid body" });
  }

  try {
    await pool.query(
      "UPDATE categorias SET nombre = ?, descripcion = ? WHERE id = ?",
      [nombre, descripcion, id]
    );
    return res.json({ message: "Categoria editado correctamente" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

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

const listarCategoriaPorId = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Invalid body" });
  }

  try {
    const [result] = await pool.query("SELECT * FROM categorias WHERE id = ?", [id]);
    return res.json({ categoria: result });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

export {
  listarCategorias,
  agregarCategoria,
  eliminarCategoria,
  editarCategoria,
  listarCategoriaPorId
};
