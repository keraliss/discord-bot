import mongoose from "mongoose";
import email from "../service/email-config";

const registerConfigSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        token: {
            type: String,
        },
        enrolled: {
            type: Boolean,
        },
        role: {
            type: String,
        },
        email: {
            type: String,
        },
    },
    { timestamps: true },
);

registerConfigSchema.post("save", async function (doc, next) {
    try {
        const response = await email.sendMail({
            from: process.env.GMAIL_EMAIL,
            to: doc.email || process.env.GMAIL_EMAIL,
            subject: "Welcome to Bitshala cohort",
            html:
                `<!DOCTYPE html>
                    <html>
                    <head>
                        <title>Welcome to the Cohort</title>
                        <style type="text/css">
                            body {
                                font-family: Arial, sans-serif;
                                background-color: #f4f4f4;
                                margin: 0;
                                padding: 0;
                            }
                            .container {
                                background-color: #ffffff;
                                margin: 20px auto;
                                padding: 20px;
                                max-width: 600px;
                                border: 1px solid #dddddd;
                                text-align: center;
                            }
                            .button {
                                display: inline-block;
                                padding: 10px 20px;
                                margin-top: 20px;
                                background-color: #7289da;
                                color: #ffffff;
                                text-decoration: none;
                                border-radius: 5px;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h1>Congratulations ` +
                `${doc.name},` +
                `on Joining the Cohort!</h1>
                            <p>Welcome! We're thrilled to have you on board. You are now a part of a community of enthusiastic learners and professionals.</p>
                            <p>To get started, join our Discord server where you can meet fellow cohort members and stay updated:</p>
                            <a href="https://discord.gg/w6Fb4r4z" class="button">Join Our Discord Server</a>
                            <p>Use the following token when you join:</p>
                            <div class="token">` +
                `${doc.token}` +
                `</div>
                            <p>Once you join, use the command <strong>/register</strong> to complete your registration.</p>
                        </div>
                    </body>
                    </html>
                `,
        });
    } catch (error) {
        console.log(error);
    }
    next();
});

const RegisterConfig = mongoose.model("RegisterConfig", registerConfigSchema);
export default RegisterConfig;
