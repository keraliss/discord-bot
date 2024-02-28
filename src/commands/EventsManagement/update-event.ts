import {
    SlashCommandBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
} from "discord.js";
import { SlashCommandProps } from "commandkit";
import ScheduledGuildEvent from "../../models/ScheduledGuildEvent";

export async function run({ interaction }: SlashCommandProps) {
    await interaction.deferReply({ ephemeral: true });

    const events = await ScheduledGuildEvent.find({ deletedAt: null });

    if (events.length === 0) {
        await interaction.followUp("There are no scheduled events to update.");
        return;
    }

    const eventsSelectMenu = new StringSelectMenuBuilder()
        .setCustomId("update-event-select")
        .setPlaceholder("Select an Event to Update")
        .addOptions(
            events.map((event) => ({
                label:
                    event.name.length > 100
                        ? event.name.slice(0, 97) + "..."
                        : event.name,
                description: `Scheduled for: ${event.scheduledStartsAt.toLocaleString()}`,
                value: event.eventId.toString(),
            })),
        );

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
        eventsSelectMenu,
    );

    await interaction.followUp({
        content: "Please choose an event to update:",
        components: [row],
    });
}

export const data = new SlashCommandBuilder()
    .setName("update-event")
    .setDescription("Update the recurrence of an event")
    .setDMPermission(false);
