import { Router } from "express";
import {
  agregarCurso,
  listarCursos,
  eliminarCurso,
} from "../services/course.service";
import {
  agregarCategoria,
  eliminarCategoria,
  listarCategorias,
} from "../services/categorie.service";
import multer from "multer";
import storageSaveF from "../utils/saveFile";

const router = Router();

const upload = multer({ storage: storageSaveF });

// Cursos
router.get("/cursos", [], listarCursos);
router.post("/cursos", [], upload.single("file"), agregarCurso);
router.delete("/cursos/:id", [], eliminarCurso);

// Categorias
router.get("/categorias", [], listarCategorias);
router.post("/categorias", [], agregarCategoria);
router.delete("/categorias/:id", [], eliminarCategoria);

export { router as routerAdmin };
