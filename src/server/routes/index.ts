import { Router } from "express";
import { OrderController, OrderItemController, ItemController, UserController} from "./../controllers";
import { uploadImage, ensureAuthenticated, sanitizeInput } from "../shared/middleware"; // 

const router = Router();

router.get("/", (req, res) => {
    return res.send("Loja ligado!");
});

router.post("/signup", sanitizeInput, UserController.signUpValidation, UserController.signUp);
router.post("/signin", sanitizeInput, UserController.signInValidation, UserController.signIn);
router.post("/passwordReset", sanitizeInput, UserController.passwordResetValidation, UserController.passwordResetRequest);
router.post("/newPassword/:chave", sanitizeInput, UserController.newPasswordValidation, UserController.newPasswordRequest);
router.post("/resendEmailConfirmation", sanitizeInput, UserController.resendEmailConfirmationValidation, UserController.resendEmailConfirmation);
router.get("/validateEmail/:chave", UserController.validateEmailValidation, UserController.validateEmail);

router.put("/produtos/:id", ensureAuthenticated, uploadImage.single("image"), sanitizeInput, ItemController.updateByIdValidation, ItemController.updateById);
router.post("/produtos", ensureAuthenticated, uploadImage.single("image"), sanitizeInput, ItemController.createValidation, ItemController.create);
router.delete("/produtos/:id", ensureAuthenticated, ItemController.deleteByIdValidation, ItemController.deleteById);
router.get("/produtos/:id", ensureAuthenticated, ItemController.getByIdValidation, ItemController.getById);
router.get("/getImg/:imageAddress", ensureAuthenticated, ItemController.getImgValidation, ItemController.getImg);
router.get("/produtos", ensureAuthenticated, ItemController.getAll);

router.post("/Order", ensureAuthenticated, OrderController.createValidation, OrderController.create);
router.get("/Order", ensureAuthenticated, OrderController.getAllValidation, OrderController.getAll);
router.get("/getItemSalesXLSX", ensureAuthenticated, OrderController.getItemSaleXLSXValidation,OrderController.getItemSaleXLSX);
router.get("/getOrderSalesXLSX", ensureAuthenticated, OrderController.getOrderSalesXSLXValidation, OrderController.getOrderSalesXSLX);

router.get("/OrderItem/:order_id", ensureAuthenticated, OrderItemController.getByOrderIdValidation, OrderItemController.getByOrderId);

export { router };