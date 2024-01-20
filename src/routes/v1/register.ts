import { randomUUID } from "crypto";
import express from "express";
import RegisterConfig from "../../models/RegisterConfig";
import email from "../../service/email-config";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { name, email, role } = req.body;
        const token = randomUUID();
        const enrolled = false;
        const user = await RegisterConfig.findOne({ email });
        if (user) {
            console.log("User already exists");
            res.json({ message: "User already present" });
        } else {
            const newUser = new RegisterConfig({
                name,
                enrolled,
                email,
                role,
                token,
            });
            newUser
                .save()
                .then((savedUser) => {
                    console.log("User saved successfully:", savedUser);
                })
                .catch((error) => {
                    console.error("Error saving user:", error);
                });
            res.json({ message: "User added successfully" });
        }
    } catch (error) {
        console.log(error);
        res.json({ message: "Error" });
    }
});

export default router;
