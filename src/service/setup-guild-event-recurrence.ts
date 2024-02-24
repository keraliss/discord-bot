import { client } from "..";
import {
    ActionRowBuilder,
    GuildScheduledEvent,
    StringSelectMenuBuilder,
} from "discord.js";
import { GuildEventRecurrence } from "../utils/constants";

export async function setupGuildEventRecurrence(
    guildEvent: GuildScheduledEvent,
    isUpdatedEvent: boolean,
) {
    try {
        const user = await client.users.fetch(guildEvent.creatorId);
        const channel = await user.createDM();

        const selectMenuBuilder = new StringSelectMenuBuilder()
            .setCustomId(`select-event-recurrence::${guildEvent.id}`)
            .setPlaceholder("Choose Recurrence");

        const recurrenceOptions = Object.entries(GuildEventRecurrence).map(
            ([key, value]) => ({
                label: key,
                value: value,
            }),
        );

        selectMenuBuilder.addOptions(recurrenceOptions);

        const selectMenu =
            new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                selectMenuBuilder,
            );

        const messageContent = isUpdatedEvent
            ? `You have updated the event: "${guildEvent.name}". Do you want to update its recurrence? Ignore if not applicable.\n`
            : `You have created a new event: "${guildEvent.name}".\n` +
              "How often does this event repeat?";

        await channel.send({
            content: messageContent,
            components: [selectMenu],
        });
    } catch (error) {
        console.error("Failed to send recurrence setup message:", error);
    }
}
