import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { SlashCommandProps } from "commandkit";
import ScheduledGuildEvent from "../../models/ScheduledGuildEvent";

export async function run({ interaction }: SlashCommandProps) {
    try {
        await interaction.deferReply({ ephemeral: true });

        const events = await ScheduledGuildEvent.find({ deletedAt: null });

        if (events.length === 0) {
            await interaction.followUp(
                "There are no scheduled events at the moment.",
            );
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle("Upcoming Events")
            .setColor("#0099ff");

        events.forEach((event) => {
            embed.addFields({
                name: event.name,
                value: `Scheduled for: ${event.scheduledStartsAt.toLocaleString()}.
                Repeats: ${event.recurrence}
                Event ID: ${event.eventId}`,
                inline: false,
            });
        });

        await interaction.followUp({ embeds: [embed] });
    } catch (error) {
        console.error(`Error in ${__filename}:\n`, error);
        await interaction.followUp(
            "Failed to fetch scheduled events. Please try again later.",
        );
    }
}

export const data = new SlashCommandBuilder()
    .setName("view-events")
    .setDescription("Displays a list of all scheduled events")
    .setDMPermission(false);
