import { Router } from "express";
import { UsuarioController, ProdutoController, OrderController, OrderItemController} from "./../controllers";
import { uploadImage, sanitizeInput, ensureAuthenticated } from "../shared/middleware";

const router = Router();

router.get("/", (req, res) => {
    return res.send("Loja ligado!");
});

router.post("/singup", UsuarioController.signUpValidation, UsuarioController.signUp);
router.post("/singin", UsuarioController.signInValidation, UsuarioController.signIn);
router.post("/passwordReset", UsuarioController.passwordResetValidation, UsuarioController.passwordResetRequest);
router.post("/newPassword/:chave", UsuarioController.newPasswordValidation, UsuarioController.newPasswordRequest);
router.post("/resendEmailConfirmation", UsuarioController.resendEmailConfirmationValidation, UsuarioController.resendEmailConfirmation);
router.get("/validateEmail/:chave", UsuarioController.validateEmailValidation, UsuarioController.validateEmail);

router.put("/produtos/:id", ensureAuthenticated, sanitizeInput, uploadImage.single("image"), ProdutoController.updateByIdValidation, ProdutoController.updateById);
router.post("/produtos", ensureAuthenticated, sanitizeInput, uploadImage.single("image"), ProdutoController.createValidation, ProdutoController.create);
router.delete("/produtos/:id", ensureAuthenticated, ProdutoController.deleteByIdValidation, ProdutoController.deleteById);
router.get("/produtos/:id", ensureAuthenticated, ProdutoController.getByIdValidation, ProdutoController.getById);
router.get("/produtos", ensureAuthenticated, ProdutoController.getAll);

router.post("/Order", ensureAuthenticated, OrderController.createValidation, OrderController.create);
router.get("/Order", ensureAuthenticated, OrderController.getAllValidation, OrderController.getAll);
router.get("/getCSV", ensureAuthenticated, OrderController.getCSVValidation, OrderController.getCSV);

router.get("/OrderItem/:order_id", ensureAuthenticated, OrderItemController.getByOrderIdValidation, OrderItemController.getByOrderId);

export { router };