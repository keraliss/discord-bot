import { randomUUID } from "crypto";
import express from "express";
import multer from "multer";
import * as papa from "papaparse";
import EmailCampaignConfig from "../../models/EmailCampaignConfig";
import { Request, Response } from "express";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post(
    "/create",
    upload.single("file"),
    async (req: Request & { file?: multer.File }, res: Response) => {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        try {
            const csvString = req.file.buffer.toString();
            const version = new Date().getFullYear().toString();

            papa.parse(csvString, {
                header: true,
                skipEmptyLines: true,
                complete: async (results) => {
                    for (const row of results.data) {
                        const fullName =
                            `${row["First name"]} ${row["Last name"]}`.trim();
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
                },
                error: (error) => {
                    console.error("CSV Parse Error:", error);
                    res.status(400).json({ message: "Error parsing CSV file" });
                },
            });
        } catch (error) {
            console.error("CSV processing error:", error);
            res.status(500).json({ message: "Error processing CSV" });
        }
    },
);

export default router;
