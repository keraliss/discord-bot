import { randomUUID } from "crypto";
import express from "express";
import RegisterConfig from "../../models/RegisterConfig";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const token = randomUUID();
        let email = req.body.email;
        const user = await RegisterConfig.findOne({ email });
        if (user) {
            console.log("User already exists");
            res.json({ message: "User already present" });
        } else {
            const newUser = new RegisterConfig({...req.body,token});
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
        console.error(error);
        res.json({ message: "Error" });
    }
});

export default router;
