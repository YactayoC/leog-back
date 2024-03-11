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

const router = Router();

// Cursos
router.get("/cursos", [], listarCursos);
router.post("/cursos", [], agregarCurso);
router.delete("/cursos/:id", [], eliminarCurso);

// Categorias
router.get("/categorias", [], listarCategorias);
router.post("/categorias", [], agregarCategoria);
router.delete("/categorias/:id", [], eliminarCategoria);

export { router as routerAdmin };
