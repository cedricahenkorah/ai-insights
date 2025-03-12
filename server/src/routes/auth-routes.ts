import express from "express";
import { googleAuth } from "../controllers/auth-controller";

const authRoutes = express.Router();

authRoutes.post("/google-auth", googleAuth);

export default authRoutes;
