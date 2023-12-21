import { Client } from "discord.js";
import { CommandKit } from "commandkit";
import { default as mongoose } from "mongoose";
require("dotenv/config");

const client = new Client({
    intents: ["Guilds", "GuildMembers", "GuildMessages", "MessageContent",],
});

new CommandKit({
    client,
    commandsPath: `${__dirname}/commands`,
    eventsPath: `${__dirname}/events`,
    devGuildIds: [],
    devUserIds: [],
    bulkRegister: true,
});

const MONGODB_URI = process.env.MONGODB_URI;
const APP_TOKEN = process.env.APP_TOKEN;

if (!MONGODB_URI || !APP_TOKEN) {
    throw new Error('Missing environment variables')
}

mongoose.connect(MONGODB_URI).then(() => {
    console.log("Connected to database.");
    client.login(APP_TOKEN);
});
