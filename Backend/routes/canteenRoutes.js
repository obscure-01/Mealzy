import * as canteenControlers from "../controllers/canteenController.js";
import auth from "../middleware/authMiddleware.js";
import verifyRoles from "../middleware/verifyRolesMiddlleware.js";
import express from "express";

const router = express.Router();

router.get("/canteen/:canteen_id", auth, canteenControlers.getCanteen);
router.get("/canteen", auth, canteenControlers.getAllCanteens);
router.post("/canteen", auth, verifyRoles("admin"), canteenControlers.createCanteen);
router.put("/canteen/:canteen_id", auth, verifyRoles( "vendor","admin"), canteenControlers.updateCanteen);
router.put("/canteen/open/:canteen_id", auth, verifyRoles("admin"), canteenControlers.openCanteen);
router.delete("/canteen/:canteen_id", auth, verifyRoles("admin"), canteenControlers.deleteCanteen);

export default router;