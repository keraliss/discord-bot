import { Client } from "discord.js";
import { CommandKit } from "commandkit";
import mongoose from "mongoose";
import { configDotenv } from "dotenv";
import express, { json, urlencoded } from "express";
import apiRoutes from "./routes";
import dotenv from "dotenv";
import cors from "cors";
import { SystemEvents, systemEventEmitter } from "./utils/event-emitter";
import { setupGuildEventOccurrence } from "./service/setup-guild-event-occurrence";
dotenv.config();
const app = express();
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());
app.use("/api", apiRoutes);

export const client = new Client({
    intents: [
        "Guilds",
        "GuildMembers",
        "GuildMessages",
        "MessageContent",
        "GuildScheduledEvents",
    ],
});

systemEventEmitter.on(SystemEvents.GuildEventCreated, setupGuildEventOccurrence);

configDotenv();

new CommandKit({
    client,
    commandsPath: `${__dirname}/commands`,
    eventsPath: `${__dirname}/events`,
    devGuildIds: ["1187273884110684241"],
    devUserIds: ["473470192404398091"],
    bulkRegister: true,
});

const MONGODB_URI = process.env.MONGODB_URI;
const TOKEN = process.env.TOKEN;

if (!MONGODB_URI || !TOKEN) {
    throw new Error("Missing environment variables");
}

mongoose.connect(MONGODB_URI).then(() => {
    console.log("Connected to database.");
    app.listen(process.env.PORT, () => {
        console.log("Server listening at PORT: " + process.env.PORT);
    });
    client.login(TOKEN);
});
