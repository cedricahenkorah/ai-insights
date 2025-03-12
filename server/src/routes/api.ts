import express from "express";
import authRoutes from "./auth-routes";

const api = express.Router();

api.use("/auth", authRoutes);

export default api;
