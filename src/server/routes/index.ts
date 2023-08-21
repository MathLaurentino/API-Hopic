import { Router } from "express";
import { OrderController, OrderItemController, ItemController, UserController} from "./../controllers";
import { uploadImage, ensureAuthenticated } from "../shared/middleware"; // 

const router = Router();

router.get("/", (req, res) => {
    return res.send("Loja ligado!");
});

router.post("/signup", UserController.signUpValidation, UserController.signUp);
router.post("/signin", UserController.signInValidation, UserController.signIn);
router.post("/passwordReset", UserController.passwordResetValidation, UserController.passwordResetRequest);
router.post("/newPassword/:chave", UserController.newPasswordValidation, UserController.newPasswordRequest);
router.post("/resendEmailConfirmation", UserController.resendEmailConfirmationValidation, UserController.resendEmailConfirmation);
router.get("/validateEmail/:chave", UserController.validateEmailValidation, UserController.validateEmail);

router.put("/produtos/:id", ensureAuthenticated, uploadImage.single("image"), ItemController.updateByIdValidation, ItemController.updateById);
router.post("/produtos", ensureAuthenticated, uploadImage.single("image"), ItemController.createValidation, ItemController.create);
router.delete("/produtos/:id", ensureAuthenticated, ItemController.deleteByIdValidation, ItemController.deleteById);
router.get("/produtos/:id", ensureAuthenticated, ItemController.getByIdValidation, ItemController.getById);
router.get("/produtos", ensureAuthenticated, ItemController.getAll);

router.post("/Order", ensureAuthenticated, OrderController.createValidation, OrderController.create);
router.get("/Order", ensureAuthenticated, OrderController.getAllValidation, OrderController.getAll);
router.get("/getXLSX", ensureAuthenticated, OrderController.getXLSXValidation, OrderController.getXLSX);

router.get("/OrderItem/:order_id", ensureAuthenticated, OrderItemController.getByOrderIdValidation, OrderItemController.getByOrderId);

export { router };