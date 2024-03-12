import { Router } from "express";
import {
  agregarCurso,
  listarCursos,
  eliminarCurso,
  actualizarCurso,
  listarCursoPorId,
} from "../services/course.service";
import {
  agregarCategoria,
  eliminarCategoria,
  listarCategorias,
  editarCategoria,
  listarCategoriaPorId
} from "../services/categorie.service";
import multer from "multer";
import storageSaveF from "../utils/saveFile";

const router = Router();

const upload = multer({ storage: storageSaveF });

// Cursos
router.get("/cursos", [], listarCursos);
router.post("/cursos", [], upload.single("file"), agregarCurso);
router.put("/cursos/:id", [], upload.single("file"), actualizarCurso);
router.delete("/cursos/:id", [], eliminarCurso);
router.get("/cursos/:id", [], listarCursoPorId);

// Categorias
router.get("/categorias", [], listarCategorias);
router.post("/categorias", [], agregarCategoria);
router.delete("/categorias/:id", [], eliminarCategoria);
router.put("/categorias/:id", [], editarCategoria);
router.get("/categorias/:id", [], listarCategoriaPorId);

export { router as routerAdmin };
