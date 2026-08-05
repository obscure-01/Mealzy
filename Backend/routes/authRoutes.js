import * as authController from "../controllers/authController.js";
import express from "express";

const router = express.Router();

router.post("/auth/logIn", authController.logIn);
router.get("/auth/accessToken", authController.createNewToken);
router.get("/auth/logOut", authController.logOut);

export default router;
