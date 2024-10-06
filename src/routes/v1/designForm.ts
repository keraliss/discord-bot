import express from "express";
import DesignFormConfig from "../../models/DesignFormConfig";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const newEduForm = new DesignFormConfig({ ...req.body });
        newEduForm
            .save()
            .then((savedUser) => {
                console.log("Designer Details saved successfully:", savedUser);
                res.json({ message: "Designer Details added successfully" });
            })
            .catch((error) => {
                console.error("Error saving user:", error);
                res.json({
                    message: "Please check the params sent, Designer details not saved",
                });
            });
    } catch (error) {
        console.error(error);
        res.json({ message: "Error" });
    }
});

export default router;
