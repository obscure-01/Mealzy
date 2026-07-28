import * as userController from "../controllers/userController.js";
import auth from "../middleware/authMiddleware.js";
import verifyRoles from "../middleware/verifyRolesMiddlleware.js";
import express from "express";

const router = express.Router();

router.post("/users", userController.createUser);
router.put("/users", auth, verifyRoles("student", "vendor","admin"), userController.updateUser);
router.get("/users/:user_id", auth, verifyRoles("student", "vendor","admin"), userController.getUser);
router.delete("/users", auth, verifyRoles("student", "vendor","admin"), userController.deleteUser);
router.put("/users/roles/:user_id", auth, verifyRoles("admin"), userController.changeRoles);

router.get("/test", auth, verifyRoles("student"), userController.test);

export default router;