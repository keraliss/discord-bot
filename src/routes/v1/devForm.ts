import express from "express";
import DevFormConfig from "../../models/DevFormConfig";
// import RegisterConfig from "../../models/RegisterConfig";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const newDevForm = new DevFormConfig({...req.body});
        newDevForm
            .save()
            .then((savedUser) => {
                console.log("Developer details saved successfully:", savedUser);
                res.json({ message: "Developer details added successfully" });
            })
            .catch((error) => {
                console.error("Error saving adding dev details: ", error);
                res.json({
                    message: "Please check the params sent, Developer details not added",
                });
            });
    } catch (error) {
        console.error(error);
        res.json({ message: "Error" });
    }
});

export default router;
