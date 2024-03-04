import mongoose from "mongoose";
import email from "../service/email-config";

const registerConfigSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        token: {
            type: String,
            required: true,
        },
        enrolled: {
            type: Boolean,
            default: false,
        },
        role: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        describeYourself: {
            type: String,
            default: "",
        },
        background: {
            type: String,
            default: "",
        },
        github: {
            type: String,
            default: "",
        },
        skills: { type: [String], default: [] },
        year: {
            type: String,
            default: "",
        },
        books: { type: [String], default: [] },
        why: {
            type: String,
            default: "",
        },
        time: {
            type: String,
            default: "",
        },
        location: {
            type: String,
            default: "",
        },
        version: {
            type: String,
            required: true,
        },
    },
    { timestamps: true },
);

registerConfigSchema.post("save", async function (doc, next) {
    try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const response = await email.sendMail({
            from: process.env.GMAIL_EMAIL,
            to: doc.email || process.env.GMAIL_EMAIL,
            subject: "Welcome to Bitshala cohort",
            html:
                `<!doctype html>
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
                                text-decoration: none;
                                display: inline-block;
                                padding: 10px 20px;
                                margin-top: 5px;
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
                `on Joining the ` +
                `${doc.role}` +
                ` Cohort!</h1>
                            <p>
                                Welcome! We're thrilled to have you onboard. Come hangout with other Bitcoiners and Developers in Bitshala Discord.
                            </p>
                            <p>
                                To get started, follow the instructions:
                            </p>
                            <p>
                                Join our Discord and use the command <strong>/register ` +
                `${doc.token}` +
                `</strong> to join ` +
                `${doc.role}` +
                ` channel.
                            </p>
                            <p>
                                Give a brief introduction in the <strong>intro</strong> channel.
                            </p>
                            <p>
                                Stay tuned in the Discord for further updates.
                            </p>
                            <a href="https://discord.gg/w6Fb4r4z" class="button"
                                >Join Our Discord Server</a
                            >
                        </div>
                    </body>
                </html>
                `,
        });
    } catch (error) {
        console.error(error);
    }
    next();
});

const RegisterConfig = mongoose.model("RegisterConfig", registerConfigSchema);
export default RegisterConfig;
