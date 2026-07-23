import { verify } from "jsonwebtoken";
import * as orderController from "../controllers/orderController.js";
import verifyRoles from "../middleware/verifyRolesMiddlleware.js";
import auth from "../middleware/authMiddleware.js";
import express from "express";

const router = express.Router();

router.post("/orders", auth, orderController.createOrder);
router.get("/user/orders/:order_id", auth, orderController.getUserOrder);
router.get("/user/orders", auth, orderController.getUserOrderHistory);
router.get("/canteen/orders/:order_id", auth, orderController.getCanteenOrder);
router.get("/canteen/orders", auth, orderController.getCanteenOrderHistory);
router.put("/user/orders/cancel/:order_id", auth, orderController.cancleOrderUser);
router.put("/canteen/orders/cancel/:order_id", auth, verifyRoles("vendor", "admin"), orderController.cancleOrderCanteen);
router.put("/canteen/orders/accept/:order_id", auth, verifyRoles("vendor", "admin"), orderController.acceptOrder);