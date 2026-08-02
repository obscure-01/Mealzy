import * as userController from "../controllers/userController.js";
import auth from "../middleware/authMiddleware.js";
import { upload  } from "../middleware/multerMiddleware.js";
import verifyRoles from "../middleware/verifyRolesMiddlleware.js";
import express from "express";

const router = express.Router();

router.post("/users", upload.single("image"), userController.createUser);
router.put("/users", auth, verifyRoles("student", "vendor","admin"), upload.single("image"), userController.updateUser);
router.get("/users/:user_id", auth, verifyRoles("student", "vendor","admin"), userController.getUser);
router.delete("/users", auth, verifyRoles("student", "vendor","admin"), userController.deleteUser);
router.put("/users/roles/:user_id", auth, verifyRoles("admin"), userController.changeRoles);

router.post("/test", auth, verifyRoles("student", "vendor", "admin"), upload.single("image"), userController.test);

export default router;