import * as orderController from "../controllers/orderController.js";
import verifyRoles from "../middleware/verifyRolesMiddlleware.js";
import auth from "../middleware/authMiddleware.js";
import express from "express";

const router = express.Router();

router.post("/orders", auth, orderController.createOrder);
router.get("/orders/user/:order_id", auth, orderController.getUserOrder);
router.get("/orders/user", auth, orderController.getUserOrderHistory);
router.get("/orders/canteen/:order_id", auth, orderController.getCanteenOrder);
router.get("/orders/canteen", auth, orderController.getCanteenOrderHistory);
router.put("/orders//usercancel/:order_id", auth, orderController.cancleOrderUser);
router.put("/orders/canteen/cancel/:order_id", auth, verifyRoles("vendor", "admin"), orderController.cancleOrderCanteen);
router.put("/orders/canteen/accept/:order_id", auth, verifyRoles("vendor", "admin"), orderController.acceptOrder);
router.put("/orders/canteen/preparing/:order_id", auth, verifyRoles("vendor", "admin"), orderController.orderPreparing);
router.put("/orders/canteen/completed/:order_id", auth, verifyRoles("vendor", "admin"), orderController.orderCompleted);

export default router;