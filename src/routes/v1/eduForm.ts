import express from "express";
import EduFormConfig from "../../models/EduFormConfig";
// import RegisterConfig from "../../models/RegisterConfig";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const newEduForm = new EduFormConfig({ ...req.body });
        newEduForm
            .save()
            .then((savedUser) => {
                console.log("Educator Details saved successfully:", savedUser);
                res.json({ message: "Educator Details added successfully" });
            })
            .catch((error) => {
                console.error("Error saving user:", error);
                res.json({
                    message: "Please check the params sent, Educator details not saved",
                });
            });
    } catch (error) {
        console.error(error);
        res.json({ message: "Error" });
    }
});

export default router;
