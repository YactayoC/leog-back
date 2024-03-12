import { Request, Response } from "express";
import { pool } from "../database/connectionDB";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";

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

  if (!nombre || !descripcion || !video_iframe || !categoria_id) {
    return res.status(400).json({ message: "Invalid body" });
  }

  if (!req.file) {
    return res.status(400).json({ message: "Invalid file" });
  }

  try {
    const fileName = uuidv4(); // Generar un nombre de archivo único
    const fileExtension = req.file.originalname.split(".").pop();
    const filePathSave = `src/uploads/${fileName}.${fileExtension}`;
    const filePathGet = `uploads/${fileName}.${fileExtension}`;

    fs.renameSync(req.file.path, filePathSave);

    const imagen_url = process.env.URL_HOST + filePathGet;

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
  const { nombre, descripcion, video_iframe, categoria_id } = req.body;

  // Validamos que al menos uno de los campos a actualizar esté presente
  if (!id || (!nombre && !descripcion && !video_iframe && !categoria_id)) {
    return res.status(400).json({ message: "Invalid body" });
  }

  try {
    let imagen_url = null; // Inicializamos la URL de la imagen como null

    // Si hay un archivo en la solicitud, procesamos la imagen
    if (req.file) {
      const fileName = uuidv4();
      const fileExtension = req.file.originalname.split(".").pop();
      const filePathSave = `src/uploads/${fileName}.${fileExtension}`;
      const filePathGet = `uploads/${fileName}.${fileExtension}`;

      fs.renameSync(req.file.path, filePathSave);

      imagen_url = process.env.URL_HOST + filePathGet;
    }

    // Construimos la consulta SQL dependiendo de si hay una imagen o no
    let sqlQuery;
    let sqlParams = [];

    if (imagen_url) {
      sqlQuery =
        "UPDATE cursos SET nombre = ?, descripcion = ?, imagen_url = ?, video_iframe = ?, categoria_id = ? WHERE id = ?";
      sqlParams = [
        nombre,
        descripcion,
        imagen_url,
        video_iframe,
        categoria_id,
        id,
      ];
    } else {
      // Solo actualizamos los campos que se proporcionaron en la solicitud
      sqlQuery = "UPDATE cursos SET ";
      const updateFields = [];

      if (nombre) {
        updateFields.push("nombre = ?");
        sqlParams.push(nombre);
      }
      if (descripcion) {
        updateFields.push("descripcion = ?");
        sqlParams.push(descripcion);
      }
      if (video_iframe) {
        updateFields.push("video_iframe = ?");
        sqlParams.push(video_iframe);
      }
      if (categoria_id) {
        updateFields.push("categoria_id = ?");
        sqlParams.push(categoria_id);
      }

      sqlQuery += updateFields.join(", ") + " WHERE id = ?";
      sqlParams.push(id);
    }

    await pool.query(sqlQuery, sqlParams);

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

const listarCursoPorId = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Invalid body" });
  }

  try {
    const [result] = await pool.query("SELECT * FROM cursos WHERE id = ?", [
      id,
    ]);
    return res.json({ curso: result[0] || {} });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export {
  listarCursos,
  agregarCurso,
  actualizarCurso,
  eliminarCurso,
  listarCursoPorId,
};
