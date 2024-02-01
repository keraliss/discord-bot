import express from "express";
import registerRoutes from "./register";
const router = express.Router();

router.use("/register", registerRoutes);

export default router;
