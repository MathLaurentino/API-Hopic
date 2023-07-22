import { Router } from "express";
// import { ensureAuthenticated, sanitizeInput } from "../shared/middleware";
// import { } from "./../controllers";

const router = Router();

router.get("/", (req, res) => {
    return res.send("Estoque ligado!");
});

export { router };