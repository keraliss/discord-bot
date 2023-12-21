import { Client } from "discord.js";
import { CommandKit } from "commandkit";
import mongoose from "mongoose";
import { configDotenv } from "dotenv";

const client = new Client({
    intents: ["Guilds", "GuildMembers", "GuildMessages", "MessageContent",],
});

configDotenv();

new CommandKit({
    client,
    commandsPath: `${__dirname}/commands`,
    eventsPath: `${__dirname}/events`,
    devGuildIds: [],
    devUserIds: [],
    bulkRegister: true,
});

const MONGODB_URI = process.env.MONGODB_URI;
const TOKEN = process.env.TOKEN;

if (!MONGODB_URI || !TOKEN) {
    throw new Error('Missing environment variables')
}

mongoose.connect(MONGODB_URI).then(() => {
    console.log("Connected to database.");
    client.login(TOKEN);
});
