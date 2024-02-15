import { client } from "..";
import { ActionRowBuilder, StringSelectMenuBuilder } from "discord.js";

export async function setupGuildEventOccurrence({ eventId, eventName, creatorId }) {
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

        await channel.send({
            content: `How often does this event "${eventName}" repeat?`,
            components: [selectMenu],
        });

        // Listening for the user's selection will be handled elsewhere, typically in your interactionCreate event listener
    } catch (error) {
        console.error("Failed to send recurrence setup message:", error);
    }
}
