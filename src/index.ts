const { Client } = require("discord.js");
const { CommandKit } = require("commandkit");
const { default: mongoose } = require("mongoose");
require("dotenv/config");

const client = new Client({
    intents: ["Guilds", "GuildMembers", "GuildMessages", "MessageContent"],
});

new CommandKit({
    client,
    commandsPath: `${__dirname}/commands`,
    eventsPath: `${__dirname}/events`,
    devGuildIds: [],
    devUserIds: [],
    bulkRegister: true,
});

mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log("Connected to database.");
    client.login(process.env.TOKEN);
});
