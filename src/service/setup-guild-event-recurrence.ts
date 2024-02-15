import { client } from "..";
import { ActionRowBuilder, StringSelectMenuBuilder } from "discord.js";

export async function setupGuildEventRecurrence({
    eventId,
    eventName,
    creatorId,
    isUpdatedEvent = false,
}) {
    try {
        const user = await client.users.fetch(creatorId);
        const channel = await user.createDM();

        const selectMenu =
            new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId(`select-recurrence::${eventId}`)
                    .setPlaceholder("Choose Recurrence")
                    .addOptions([
                        {
                            label: "Daily",
                            value: "daily",
                        },
                        {
                            label: "Weekly",
                            value: "weekly",
                        },
                        {
                            label: "Monthly",
                            value: "monthly",
                        },
                        {
                            label: "None",
                            value: "none",
                        },
                    ]),
            );

        const messageContent = isUpdatedEvent
            ? `You have updated the event: "${eventName}". Do you want to update its recurrence? Ignore if not applicable.\n`
            : `You have created a new event: "${eventName}".\n` +
              "How often does this event repeat?";

        await channel.send({
            content: messageContent,
            components: [selectMenu],
        });
    } catch (error) {
        console.error("Failed to send recurrence setup message:", error);
    }
}
