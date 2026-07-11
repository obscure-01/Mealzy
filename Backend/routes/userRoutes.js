import * as userController from "../controllers/userController.js";
import auth from "../middleware/authMiddleware.js";
import express from "express";

const router = express.Router();

router.post("/user", userController.createUser);
router.get("/user/login", userController.login);
router.get("/test", auth, userController.test);

export default router;