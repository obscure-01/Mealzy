import * as orderController from "../controllers/orderController.js";
import auth from "../middleware/authMiddleware.js";
import express from "express";

const router = express.Router();

router.post("/order", auth, orderController.createOrder);
