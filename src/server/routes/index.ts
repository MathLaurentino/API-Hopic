import { Router } from "express";
// import { sanitizeInput } from "../shared/middleware";
import { UsuarioController, ProdutoController } from "./../controllers";
import { uploadImage } from "../shared/middleware";

const router = Router();

router.get("/", (req, res) => {
    return res.send("Loja ligado!");
});

router.post("/cadastrar", UsuarioController.signUpValidation, UsuarioController.signUp);
router.post("/entrar", UsuarioController.signInValidation, UsuarioController.signIn);
router.get("/validateEmail/:chave", UsuarioController.validateEmailValidation, UsuarioController.validateEmail);

router.post("/produtos", uploadImage.single("image"), ProdutoController.createValidation, ProdutoController.create);


export { router };