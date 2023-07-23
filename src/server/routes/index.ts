import { Router } from "express";
// import { sanitizeInput } from "../shared/middleware";
import { UsuarioController } from "./../controllers";

const router = Router();

router.get("/", (req, res) => {
    return res.send("Loja ligado!");
});

router.post("/cadastrar", UsuarioController.signUpValidation, UsuarioController.signUp);
router.post("/entrar", UsuarioController.signInValidation, UsuarioController.signIn);

export { router };