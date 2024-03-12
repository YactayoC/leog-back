import { Router } from "express";
import { iniciarSesion, registrarUsuario } from "../services/auth.service";

const router = Router();

router.post("/iniciar-sesion", [], iniciarSesion);
router.post("/registrar-usuario", [], registrarUsuario);

export { router as routerAuth };
