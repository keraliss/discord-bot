import express from "express";
import registerRoutes from "./register";
import devFormRoutes from "./devForm";
import eduFormRoutes from "./eduForm";
import designFormRoutes from "./designForm";
const router = express.Router();

router.use("/register", registerRoutes);
router.use("/devform", devFormRoutes);
router.use("/eduform", eduFormRoutes);
router.use("/designform", designFormRoutes);

export default router;
