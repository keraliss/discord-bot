import { Interaction } from "discord.js";
import ScheduledGuildEvent from "../../models/ScheduledGuildEvent";

export default async function (interaction: Interaction) {
    if (!interaction.isStringSelectMenu()) return;

    const customId = interaction.customId;
    const [prefix, eventId] = customId.split("::");

    if (prefix === "select-recurrence") {
        const selectedRecurrence = interaction.values[0];
        try {
            await ScheduledGuildEvent.updateOne(
                { eventId },
                { recurrence: selectedRecurrence },
            );

            await interaction.reply({
                content: `Recurrence set to ${selectedRecurrence}`,
                ephemeral: true,
            });
        } catch (error) {
            console.error("Failed to update event recurrence:", error);
            await interaction.reply({
                content: "Failed to set recurrence. Please try again later.",
                ephemeral: true,
            });
        }
    }
}
