import { Router } from "express";
import { iniciarSesion } from "../services/auth.service";

const router = Router();

router.post("/iniciar-sesion", [], iniciarSesion);

export { router as routerAuth };
