import { ActionRowBuilder, Interaction, StringSelectMenuBuilder } from "discord.js";
import ScheduledGuildEvent from "../../models/ScheduledGuildEvent";
import { GuildEventRecurrence } from "../../utils/constants";

export default async function (interaction: Interaction) {
    if (!interaction.isStringSelectMenu()) return;

    const customId = interaction.customId;
    const prefix = customId.split("::")[0];

    if (prefix === "select-event-recurrence") {
        const eventId = customId.split("::")[1];

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
    } else if (prefix === "update-event-select") {
        const selectedEventId = interaction.values[0];

        const event = await ScheduledGuildEvent.findOne({
            eventId: selectedEventId,
        });
        if (!event) {
            await interaction.reply({
                content: "Event not found.",
                ephemeral: true,
            });
            return;
        }

        const recurrenceSelectMenu = new StringSelectMenuBuilder()
            .setCustomId(`select-event-recurrence::${selectedEventId}`) // Reuse or adjust as necessary
            .setPlaceholder("Select New Recurrence");

        const recurrenceOptions = Object.entries(GuildEventRecurrence).map(
            ([key, value]) => ({
                label: key,
                value: value,
            }),
        );

        recurrenceSelectMenu.addOptions(recurrenceOptions);

        const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            recurrenceSelectMenu,
        );

        await interaction.update({
            content: "Please choose a new recurrence for the event:",
            components: [row],
        });
    }
}
