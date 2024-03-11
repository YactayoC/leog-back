import { Request, Response } from "express";
import { pool } from "../database/connectionDB";

const listarCursos = async (req: Request, res: Response) => {
  try {
    const [result] = await pool.query(
      "SELECT cursos.*, categorias.nombre as categoria_nombre FROM cursos INNER JOIN categorias ON cursos.categoria_id = categorias.id"
    );
    return res.json({ cursos: result || [] });
  } catch (error) {
    console.error("Error al ejecutar la consulta:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const agregarCurso = async (req: Request, res: Response) => {
  const { nombre, descripcion, video_iframe, categoria_id } = req.body;

  if (
    !nombre ||
    !descripcion ||
    !video_iframe ||
    !categoria_id
  ) {
    return res.status(400).json({ message: "Invalid body" });
  }

  if (!req.file) {
    return res.status(400).json({ message: "Invalid file" });
  }

  try {
    let filePath = req.file.path;
    filePath = filePath.replace(/\\/g, "/");

    const imagen_url = "http://localhost:3000/" + filePath;

    await pool.query("CALL agregar_curso(?, ?, ?, ?, ?)", [
      nombre,
      descripcion,
      imagen_url,
      video_iframe,
      categoria_id,
    ]);
    return res.json({ message: "Curso agregado correctamente" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// FALLTA PROBAR
const actualizarCurso = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nombre, descripcion, imagen_url, video_iframe, categoria_id } =
    req.body;

  if (
    !id ||
    !nombre ||
    !descripcion ||
    !imagen_url ||
    !video_iframe ||
    !categoria_id
  ) {
    return res.status(400).json({ message: "Invalid body" });
  }

  try {
    await pool.query(
      "UPDATE cursos SET nombre = ?, descripcion = ?, imagen_url = ?, video_iframe = ?, categoria_id = ? WHERE id = ?",
      [nombre, descripcion, imagen_url, video_iframe, categoria_id, id]
    );
    return res.json({ message: "Curso actualizado correctamente" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const eliminarCurso = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Invalid body" });
  }

  try {
    await pool.query("DELETE FROM cursos WHERE id = ?", [id]);
    return res.json({ message: "Curso eliminado correctamente" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { listarCursos, agregarCurso, actualizarCurso, eliminarCurso };
