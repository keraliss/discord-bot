import { ActionRowBuilder, StringSelectMenuBuilder, ChannelType } from "discord.js";
import ScheduledGuildEvent from "../models/ScheduledGuildEvent";
import { client } from "..";

export async function setupGuildEventChannel({ eventId, guildId }) {
    try {
        const event = await ScheduledGuildEvent.findOne({
            eventId,
        });
        if (!event) throw new Error("Event not found");

        const creatorId = event.creatorId;
        const user = await client.users.fetch(creatorId);

        if (!guildId)
            throw new Error("This interaction is not associated with a guild.");

        const guild = await client.guilds.fetch(guildId);
        const channels = guild.channels.cache.filter(
            (channel) => channel.type === ChannelType.GuildText,
        );

        const selectMenuBuilder = new StringSelectMenuBuilder()
            .setCustomId(`select-target-channel::${eventId}`)
            .setPlaceholder("Select a Target Channel");

        const channelOptions = channels.map((channel) => ({
            label: channel.name.substring(0, 100),
            value: channel.id,
        }));

        selectMenuBuilder.addOptions(channelOptions);

        const selectMenu =
            new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                selectMenuBuilder,
            );

        await user.send({
            content: `Select a target channel for the event: "${event.name}".`, // Using event.name assuming it's available
            components: [selectMenu],
        });
    } catch (error) {
        console.error("Failed to setup target channel for event:", error);
    }
}
