import { Router } from "express";
import { UsuarioController, ProdutoController, OrderController} from "./../controllers";
import { uploadImage, sanitizeInput, ensureAuthenticated } from "../shared/middleware";

const router = Router();

router.get("/", (req, res) => {
    return res.send("Loja ligado!");
});

router.post("/singup", UsuarioController.signUpValidation, UsuarioController.signUp);
router.post("/singin", UsuarioController.signInValidation, UsuarioController.signIn);
router.get("/validateEmail/:chave", UsuarioController.validateEmailValidation, UsuarioController.validateEmail);

router.use(ensureAuthenticated);

router.put("/produtos/:id", sanitizeInput, uploadImage.single("image"), ProdutoController.updateByIdValidation, ProdutoController.updateById);
router.post("/produtos", sanitizeInput, uploadImage.single("image"), ProdutoController.createValidation, ProdutoController.create);
router.delete("/produtos/:id", ProdutoController.deleteByIdValidation, ProdutoController.deleteById);
router.get("/produtos/:id", ProdutoController.getByIdValidation, ProdutoController.getById);
router.get("/produtos", ProdutoController.getAll);

router.post("/Order", OrderController.createValidation, OrderController.create);

export { router };