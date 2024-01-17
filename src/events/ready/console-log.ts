import { Client } from "discord.js";

module.exports = (client: Client) => {
    console.log(`Logged in as ${client?.user?.username}`);
};
