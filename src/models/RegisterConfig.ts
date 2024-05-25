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
        cohortName: {
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
                `<!DOCTYPE html>
        <html>
        <head>
            <title>Welcome to the Cohort</title>
            <style type="text/css">
            body {
                font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
                background-color: #fff2de;
                margin: 0;
                padding: 0;
            }
            .container {
                background-color: rgb(51, 51, 51);
                color: #ffffff;
                margin: 20px auto;
                padding: 40px;
                max-width: 600px;
                border-radius: 8px;
                text-align: center;
            }
            span,
            strong {
                color: rgb(250, 136, 22);
            }
            p {
                font-size: 16px;
                line-height: 1.6;
            }
            .button {
                display: inline-block;
                padding: 12px 25px;
                margin-top: 20px;
                background-color: #ffffff;
                color: rgb(51, 51, 51);
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                transition: background-color 0.15s ease, color 0.15s ease;
            }
            .button:hover {
                background-color: #fa8816;
                color: #ffffff;
            }
            a {
                text-decoration: none !important;
            }
            a span {
                color: #fa8816 !important;
            }
            a span:hover {
                color: #ffffff !important;
            }
            </style>
        </head>
        <body>
            <div class="container">
            <h1>
                Congratulations <span>` +
                ` ${doc.name}, ` +
                `</span> on Joining the
                <span> ` +
                `${doc.cohortName}` +
                ` </span> Cohort!
            </h1>
            <p>
                Welcome! We're thrilled to have you onboard. Come hangout with other
                Bitcoiners and Developers in Bitshala Discord.
            </p>
            <p>To get started, follow the instructions:</p>
            <p>
                Join our
                <a href="https://discord.gg/nXeeBHDHrt" style="text-decoration: none"
                ><span>Discord</span></a
                >
                and use the command
                <strong>/register</strong> followed by the token
                <strong>` +
                ` ${doc.token}` +
                `</strong>
                to join` +
                ` ${doc.cohortName} ` +
                `channels.
            </p>
            <p>
                Give a brief introduction in the
                <strong
                ><a href="https://discord.gg/uW7AsuwaZm"
                    ><span>intro</span></a
                ></strong
                >
                channel.
            </p>
            <p>Stay tuned in the Discord for further updates.</p>
            <p><strong>Tips</strong>:</p>
            <p>
                - Execute the ` +
                ` \` /register \` ` +
                `command in the
                <a href="https://discord.gg/d3WEur4WNj"
                ><strong>#registration</strong></a
                >
                channel.
            </p>
            <p>
                - <strong>DO NOT</strong> copy-paste the command. Start typing
                <strong><code>/register</code></strong> and select the full command from
                the drop-up menu. You can copy-paste the
                <strong><code>token</code></strong> in the token field.
            </p>

            <a href="https://discord.gg/nXeeBHDHrt" class="button"
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
