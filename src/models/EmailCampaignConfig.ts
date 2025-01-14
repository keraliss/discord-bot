import mongoose from "mongoose";
import mailsender from "../service/email-config";

const emailCampaignSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        ghName: {
            type: String,
            default: "",
        },
        email: {
            type: String,
            required: true,
        },
        discordUsername: {
            type: String,
            default: "",
        },
        background: {
            type: String,
            default: "",
        },
        timeZone: {
            type: String,
            default: "",
        },
        country: {
            type: String,
            default: "",
        },
        cohortName: {
            type: String,
            required: true,
        },
        version: {
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
    },
    { timestamps: true },
);

emailCampaignSchema.post("save", async function (doc, next) {
    try {
        if (!doc.enrolled) {
            const dynamicHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      body {
        font-family: "Arial", sans-serif;
        background-color: #f5f5f5;
        margin: 0;
        padding: 0;
        line-height: 1.2rem;
      }
      .email-container {
        max-width: 600px;
        background: #ffffff;
        margin: 20px auto;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
      }
      .section {
        margin: 25px 0;
      }
      h2 {
        color: #333333;
        margin-top: 30px;
        font-size: 1.2em;
        font-weight: bold;
      }
      p,
      ul,
      ol {
        color: #333333;
        text-align: left;
        margin: 15px 0;
      }
      ul,
      ol {
        padding-left: 20px;
      }
      li {
        margin-bottom: 10px;
      }
      .bold {
        font-weight: bold;
      }
      .subject {
        font-size: 1.3em;
        font-weight: bold;
        margin-bottom: 20px;
      }
      .centered-button {
        text-align: center;
      }
      .centered-button a {
        display: inline-block;
        padding: 10px 20px;
        background-color: #007bff;
        color: white;
        text-decoration: none;
        border-radius: 5px;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <p class="subject">
        Welcome to the Bitshala BOSS Program – Your Journey Begins!
      </p>
      <p>Hello ${doc.name},</p>
      <p>
        Congratulations on qualifying for the Chaincode BOSS Program under
        Bitshala's guidance! You're part of a special group, who has been
        selected out of hundreds of aspirants. Hope you are ready to take on the
        challenges of Bitcoin Open Source Software!
      </p>
      <h2>Here's What You Need to Know:</h2>
      <ul>
        <li>
          <span class="bold">Program Structure:</span> It's designed to be
          rigorous, pushing you to your limits. Not everyone may finish, but
          every step you take is a stride towards mastering Bitcoin.
        </li>
        <li>
          <span class="bold">Guidance:</span> You're not alone on this journey.
          Bitshala will provide guidance through Office Hours, starting 17th
          January, every Friday from 7:00 to 8:00 PM IST for the next four
          weeks. (Since most of you are near Indian time zones) This is your
          chance to clarify doubts without shortcuts – you'd need this skill
          while developing open source in the real world.
        </li>
        <li>
          <span class="bold">Expectations:</span>
          <ul>
            <li>Tackle challenges within a week.</li>
            <li>
              Participate actively in discussions. Your engagement is key—not
              just solving tasks but helping peers, asking questions, and
              contributing to the community.
            </li>
            <li>
              Document your code well. Innovative solutions are encouraged;
              share them proudly.
            </li>
          </ul>
        </li>
        <li>
          <span class="bold">Ethics:</span> Integrity is paramount. If you have
          prior solutions from last year, do not use or share them. Any form of
          cheating will lead to immediate disqualification for both the provider
          and the receiver.
        </li>
      </ul>
      <h2>Join Bitshala Discord:</h2>
      <p>
        Join our
        <a href="https://discord.gg/nXeeBHDHrt" style="text-decoration: none"
          ><span>Discord</span></a
        >
        and use the command
        <strong>/register</strong> followed by the token
        <strong>` + ` ${doc.token}` + `</strong>
        to join` + ` ${doc.cohortName} ` + `channels.
      </p>
      <div class="centered-button">
        <a href="https://discord.com/invite/STeQFVEWf9">Join now</a>
      </div>
      <p>
        If you face issues in getting added to Chaincode specific channel,
        please DM Bitshala admins or officials
      </p>
      <p>Cheers,<br />The Bitshala Team</p>
    </div>
  </body>
</html>
`;

            // const response = await mailsender.sendMail({
            //     from: `"Bitshala Org" <${process.env.GMAIL_EMAIL}>`,
            //     to: doc.email,
            //     subject: `Welcome to ${doc.cohortName} Cohort`,
            //     html: dynamicHtml,
            // });
        }
    } catch (error) {
        console.error("Email send error:", error);
    }
    next();
});

const EmailCampaignConfig = mongoose.model(
    "EmailCampaignConfig",
    emailCampaignSchema,
);
export default EmailCampaignConfig;
