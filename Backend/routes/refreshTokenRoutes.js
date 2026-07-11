import * as refreshTokenController from "../controllers/refreshTokenController.js";
import express from "express";

const router = express.Router();

router.get("/accessToken", refreshTokenController.createNewToken);

export default router;
