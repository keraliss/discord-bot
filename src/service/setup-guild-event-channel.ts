import {
    ActionRowBuilder,
    StringSelectMenuBuilder,
    ChannelType,
    GuildScheduledEvent,
} from "discord.js";
import ScheduledGuildEvent from "../models/ScheduledGuildEvent";
import { client } from "..";

export async function setupGuildEventChannel(
    guildEvent: GuildScheduledEvent,
    isUpdatedEvent: false,
) {
    try {
        const event = await ScheduledGuildEvent.findOne({
            eventId: guildEvent.id,
            deletedAt: null,
        });
        if (!event) throw new Error("Event not found");

        const creatorId = event.creatorId;
        const user = await client.users.fetch(creatorId);

        if (!guildEvent.id)
            throw new Error("This interaction is not associated with a guild.");

        const guild = await client.guilds.fetch(guildEvent.guildId);
        const channels = guild.channels.cache.filter(
            (channel) => channel.type === ChannelType.GuildText,
        );

        const selectMenuBuilder = new StringSelectMenuBuilder()
            .setCustomId(`select-target-channel::${guildEvent.id}`)
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
            content: isUpdatedEvent
                ? `Do you want to update the target channel for the event ${event.name}?`
                : `Select a target channel for the event: "${event.name}".`,
            components: [selectMenu],
        });
    } catch (error) {
        console.error("Failed to setup target channel for event:", error);
    }
}
