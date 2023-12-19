import { CommandInteraction, Client } from "discord.js";
import { CommandData, CommandOptions } from "commandkit";

const data: CommandData = {
    name: "ping",
    description: "Pong!",
};

function run({ interaction, client }: { interaction: CommandInteraction; client: Client }) {
    interaction.reply(`:ping_pong: Pong! ${client.ws.ping}ms`);
}

const options: CommandOptions = {
    devOnly: true,
};

module.exports = { data, run, options };
