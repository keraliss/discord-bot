import { randomUUID } from "crypto";
import express from "express";
import EmailCampaignConfig from "../../models/EmailCampaignConfig";
import { cohortData } from "../../service/cohortData";

const router = express.Router();

router.post("/create", async (req, res) => {
    try {
        const version = new Date().getFullYear().toString();

        for (const row of cohortData) {
            const fullName = `${row["First name"]} ${row["Last name"]}`.trim();
            const token = randomUUID();
            const userToken = btoa(token).substring(0, 10);

            const newCampaignEntry = new EmailCampaignConfig({
                name: fullName,
                email: row["Email"],
                ghName: row["GH_NAME"],
                discordUsername: row["Discord Username"],
                background: row["Background"],
                timeZone: row["Time Zone in UTC"],
                country: row["Country"],
                cohortName: row["Cohort"] || "Default Cohort",
                version: version,
                token: userToken,
            });

            await newCampaignEntry.save();
        }

        res.json({ message: "Campaign processed successfully" });
    } catch (error) {
        console.error("Processing error:", error);
        res.status(500).json({ message: "Error processing data" });
    }
});

export default router;
