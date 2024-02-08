import express from "express";
import registerRoutes from "./register";
const router = express.Router();

router.get("/healthcheck", async (req, res) => {
    res.send("OK");
});
router.use("/register", registerRoutes);

export default router;
