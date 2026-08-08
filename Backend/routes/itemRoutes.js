import * as itemController from "../controllers/itemController.js";
import auth from "../middleware/authMiddleware.js";
import { upload } from "../middleware/multerMiddleware.js";
import verifyRoles from "../middleware/verifyRolesMiddlleware.js";
import express from "express";

const router = express.Router();

router.get("/item/:item_id", auth, itemController.getItem);
router.get("/item", auth, itemController.findItems);
router.post("/item", auth, verifyRoles("vendor", "admin"), upload.single("image"), itemController.createItem);
router.put("/item/:item_id", auth, verifyRoles("vendor", "admin"), upload.single("image"), itemController.updateItem);
router.put("/item/available/:item_id", auth, verifyRoles("vendor", "admin"), itemController.changeAvailability);
router.delete("/item/:item_id", auth, verifyRoles("vendor", "admin"), itemController.deleteItem);

export default router;