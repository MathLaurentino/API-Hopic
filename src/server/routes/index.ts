import { Router } from "express";
import { UsuarioController, ProdutoController } from "./../controllers";
import { uploadImage, ensureAuthenticated, sanitizeInput } from "../shared/middleware";

const router = Router();

router.get("/", (req, res) => {
    return res.send("Loja ligado!");
});

router.post("/singup", UsuarioController.signUpValidation, UsuarioController.signUp);
router.post("/singin", UsuarioController.signInValidation, UsuarioController.signIn);
router.get("/validateEmail/:chave", UsuarioController.validateEmailValidation, UsuarioController.validateEmail);

router.post("/produtos", ensureAuthenticated, sanitizeInput, uploadImage.single("image"), ProdutoController.createValidation, ProdutoController.create);
router.delete("/produtos/:id", ensureAuthenticated, ProdutoController.deleteByIdValidation, ProdutoController.deleteById);
router.get("/produtos/:id", ensureAuthenticated, ProdutoController.getByIdValidation, ProdutoController.getById);

export { router };