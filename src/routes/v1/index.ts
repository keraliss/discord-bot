import express from "express";
import registerRoutes from "./register";
import devFormRoutes from "./devForm";
import eduFormRoutes from "./eduForm";
import designFormRoutes from "./designForm";
import emailCampaignRoutes from "./emailCampaign";

const router = express.Router();

router.use("/register", registerRoutes);
router.use("/devform", devFormRoutes);
router.use("/eduform", eduFormRoutes);
router.use("/designform", designFormRoutes);
router.use("/email-campaign", emailCampaignRoutes);

export default router;
