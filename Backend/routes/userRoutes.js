import * as userController from "../controllers/userController.js";
import auth from "../middleware/authMiddleware.js";
import verifyRoles from "../middleware/verifyRolesMiddlleware.js";
import express from "express";

const router = express.Router();

router.post("/user", userController.createUser);
router.get("/test", auth, verifyRoles("student"), userController.test);

export default router;