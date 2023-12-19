import { Client } from "discord.js";
import { CommandKit } from "commandkit";
import "dotenv/config"

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

client.login(process.env.TOKEN);
