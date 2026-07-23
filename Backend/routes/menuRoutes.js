import * as menuController from "../controllers/menuController.js";
import auth from "../middleware/authMiddleware.js";
import verifyRoles from "../middleware/verifyRolesMiddlleware.js";
import express from "express";

const router = express.Router();

router.get("/menu/:canteen_id", auth, menuController.getAvailableMenu);
router.get("/menu", auth, verifyRoles("vendor", "admin"), menuController.getCompleteMenu);
router.put("/menu", auth, verifyRoles("vendor", "admin"), menuController.updateMenu);

export default router;
