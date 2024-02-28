import { SlashCommandBuilder } from "discord.js";
import { SlashCommandProps } from "commandkit";
import ScheduledGuildEvent from "../../models/ScheduledGuildEvent";
import createEvent from "../../events/guildScheduledEventCreate/create-event";
import updateEvent from "../../events/guildScheduledEventUpdate/update-event";

export async function run({ interaction }: SlashCommandProps) {
    try {
        await interaction.deferReply({ ephemeral: true });

        const guild = interaction.guild;
        if (!guild) {
            await interaction.followUp("This command can only be used in a guild.");
            return;
        }

        const discordEvents = await guild.scheduledEvents.fetch();
        const dbEvents = await ScheduledGuildEvent.find({ deletedAt: null });

        for (const event of discordEvents.values()) {
            const dbEvent = dbEvents.find((e) => e.eventId === event.id);
            if (!dbEvent) {
                await createEvent(event);
            } else {
                await updateEvent(event, event);
            }
        }

        const discordEventIds = discordEvents.map((event) => event.id);
        for (const dbEvent of dbEvents) {
            if (!discordEventIds.includes(dbEvent.eventId)) {
                await ScheduledGuildEvent.updateOne(
                    { eventId: dbEvent.eventId },
                    { deletedAt: new Date() },
                );
            }
        }

        await interaction.followUp("Events synchronization complete.");
    } catch (error) {
        console.error(`Error in ${__filename}:\n`, error);
        await interaction.followUp(
            "Failed to synchronize events. Please try again later.",
        );
    }
}

export const data = new SlashCommandBuilder()
    .setName("sync-events")
    .setDescription("Synchronizes all scheduled events from Discord to the database")
    .setDMPermission(false);
