import { Router } from "express";
import { OrderController, OrderItemController, ProdutoController, UsuarioController} from "./../controllers";
// import { UsuarioController } from "../controllers/Usuario";
// import { ProdutoController } from "../controllers/Produto";
import { uploadImage, sanitizeInput, ensureAuthenticated } from "../shared/middleware"; // 

const router = Router();

router.get("/", (req, res) => {
    return res.send("Loja ligado!");
});

router.post("/signup", UsuarioController.signUpValidation, UsuarioController.signUp);
router.post("/signin", UsuarioController.signInValidation, UsuarioController.signIn);
router.post("/passwordReset", UsuarioController.passwordResetValidation, UsuarioController.passwordResetRequest);
router.post("/newPassword/:chave", UsuarioController.newPasswordValidation, UsuarioController.newPasswordRequest);
router.post("/resendEmailConfirmation", UsuarioController.resendEmailConfirmationValidation, UsuarioController.resendEmailConfirmation);
router.get("/validateEmail/:chave", UsuarioController.validateEmailValidation, UsuarioController.validateEmail);

router.put("/produtos/:id", ensureAuthenticated, uploadImage.single("image"), sanitizeInput, ProdutoController.updateByIdValidation, ProdutoController.updateById);
router.post("/produtos", ensureAuthenticated, uploadImage.single("image"), sanitizeInput, ProdutoController.createValidation, ProdutoController.create);
router.delete("/produtos/:id", ensureAuthenticated, ProdutoController.deleteByIdValidation, ProdutoController.deleteById);
router.get("/produtos/:id", ensureAuthenticated, ProdutoController.getByIdValidation, ProdutoController.getById);
router.get("/produtos", ensureAuthenticated, ProdutoController.getAll);

router.post("/Order", ensureAuthenticated, OrderController.createValidation, OrderController.create);
router.get("/Order", ensureAuthenticated, OrderController.getAllValidation, OrderController.getAll);
router.get("/getXLSX", ensureAuthenticated, OrderController.getXLSXValidation, OrderController.getXLSX);

router.get("/OrderItem/:order_id", ensureAuthenticated, OrderItemController.getByOrderIdValidation, OrderItemController.getByOrderId);

export { router };