import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client } from "discord.js";
import ScheduledGuildEvent, {
    calculateNextOccurrence,
} from "../../models/ScheduledGuildEvent";

const FIVE_MINUTES_IN_MS = 60000 * 5;
const THREE_DAYS_IN_MS = 60000 * 60 * 24 * 3; // Minutes * Hours * Days

export default function scheduleEventReminders(client: Client) {
    checkForUpcomingEvents();

    setInterval(checkForUpcomingEvents, FIVE_MINUTES_IN_MS);

    async function checkForUpcomingEvents() {
        try {
            const now = new Date();
            const upcomingEvents = await ScheduledGuildEvent.find({
                nextOccurrence: {
                    $lte: new Date(now.getTime() + THREE_DAYS_IN_MS),
                    $gt: now, // not already started
                },
                deletedAt: null,
            });

            upcomingEvents.forEach(async (event) => {
                try {
                    const msUntilEvent =
                        event.nextOccurrence.getTime() - now.getTime();

                    if (
                        !event.lastReminderSentAt ||
                        new Date(event.lastReminderSentAt) < event.nextOccurrence
                    ) {
                        if (!event.description) {
                            const creator = await client.users.fetch(
                                event.creatorId,
                            );

                            const openLinkModalButton = new ButtonBuilder()
                                .setCustomId(`open-link-modal::${event.eventId}`)
                                .setLabel("Provide Event Description and Link")
                                .setStyle(ButtonStyle.Primary);

                            const row =
                                new ActionRowBuilder<ButtonBuilder>().addComponents(
                                    openLinkModalButton,
                                );

                            await creator.send({
                                content: constructMessage(event, msUntilEvent),
                                components: [row],
                            });

                            await ScheduledGuildEvent.updateOne(
                                { _id: event._id },
                                {
                                    $set: { lastReminderSentAt: new Date() },
                                    nextOccurrence: calculateNextOccurrence(
                                        event.scheduledStartsAt,
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        event.recurrence as any,
                                    ),
                                },
                            );
                        }
                    }
                } catch (error) {
                    console.error(
                        `Failed to send reminder for event "${event.name}":`,
                        error,
                    );
                }
            });
        } catch (error) {
            console.error(`Error scheduling event reminders:\n`, error);
        }
    }
}

function constructMessage(event, msUntilEvent) {
    const timeMessageParts = [];
    const daysUntilEvent = Math.floor(msUntilEvent / (1000 * 60 * 60 * 24));
    if (daysUntilEvent > 0) timeMessageParts.push(`${daysUntilEvent} day(s)`);

    const hoursUntilEvent = Math.floor(
        (msUntilEvent % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    if (hoursUntilEvent > 0) timeMessageParts.push(`${hoursUntilEvent} hour(s)`);

    const minutesUntilEvent = Math.floor(
        (msUntilEvent % (1000 * 60 * 60)) / (1000 * 60),
    );
    if (minutesUntilEvent > 0)
        timeMessageParts.push(`${minutesUntilEvent} minute(s)`);

    return `Reminder: Your event "${
        event.name
    }" is starting in ${timeMessageParts.join(
        ", ",
    )}. Please provide the event description, and a custom link if any, by clicking the button below.`;
}
