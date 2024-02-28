import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client } from "discord.js";
import ScheduledGuildEvent, {
    calculateNextOccurrence,
} from "../../models/ScheduledGuildEvent";
import { GuildEventRecurrence } from "../../utils/constants";

const FIVE_MINUTES_IN_MS = 60000 * 5;

export default function scheduleEventReminders(client: Client) {
    checkForUpcomingEvents();

    setInterval(checkForUpcomingEvents, FIVE_MINUTES_IN_MS);

    async function checkForUpcomingEvents() {
        try {
            const now = new Date();
            const upcomingEvents = await ScheduledGuildEvent.find({
                nextOccurrence: {
                    $lte: new Date(now.getTime() + 30 * 60000), // within the next 30 minutes
                    $gt: now, // not already started
                },
                lastReminderSent: null,
                deletedAt: null,
            });

            upcomingEvents.forEach(async (event) => {
                try {
                    if (!event.lastReminderSent) {
                        const msUntilEvent =
                            event.nextOccurrence.getTime() - now.getTime();
                        const minutesUntilEvent = Math.round(msUntilEvent / 60000);

                        const creator = await client.users.fetch(event.creatorId);

                        const openLinkModalButton = new ButtonBuilder()
                            .setCustomId(`open-link-modal::${event.eventId}`)
                            .setLabel("Provide Event Link")
                            .setStyle(ButtonStyle.Primary);

                        const row =
                            new ActionRowBuilder<ButtonBuilder>().addComponents(
                                openLinkModalButton,
                            );

                        await creator.send({
                            content: `Reminder: Your event "${event.name}" is starting in ${minutesUntilEvent} minute(s). Please provide the event link by clicking the button below.`,
                            components: [row],
                        });

                        await ScheduledGuildEvent.updateOne(
                            { _id: event._id },
                            { $set: { lastReminderSent: now } },
                        );
                    }
                } catch (error) {
                    console.error(
                        `Failed to send reminder for event "${event.name}":`,
                        error,
                    );
                }

                if (event.recurrence != GuildEventRecurrence["Does not repeat"]) {
                    const nextOccurrence = calculateNextOccurrence(
                        event.scheduledStartsAt,
                        event.recurrence as keyof typeof GuildEventRecurrence,
                    );

                    await ScheduledGuildEvent.updateOne(
                        { _id: event._id },
                        { nextOccurrence, $unset: { lastReminderSent: "" } },
                    );
                }
            });
        } catch (error) {
            console.error(`Error scheduling event reminders:\n`, error);
        }
    }
}
