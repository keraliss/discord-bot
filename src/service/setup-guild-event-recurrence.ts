import { client } from "..";
import { ActionRowBuilder, StringSelectMenuBuilder } from "discord.js";
import { GuildEventRecurrence } from "../utils/constants";
import { setupGuildEventChannel } from "./setup-guild-event-channel";

export async function setupGuildEventRecurrence({
    eventId,
    eventName,
    creatorId,
    isUpdatedEvent = false,
    guildId,
}) {
    try {
        const user = await client.users.fetch(creatorId);
        const channel = await user.createDM();

        const selectMenuBuilder = new StringSelectMenuBuilder()
            .setCustomId(`select-event-recurrence::${eventId}`)
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
            ? `You have updated the event: "${eventName}". Do you want to update its recurrence? Ignore if not applicable.\n`
            : `You have created a new event: "${eventName}".\n` +
              "How often does this event repeat?";

        await channel.send({
            content: messageContent,
            components: [selectMenu],
        });

        setupGuildEventChannel({ eventId, guildId });
    } catch (error) {
        console.error("Failed to send recurrence setup message:", error);
    }
}
