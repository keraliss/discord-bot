import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client } from "discord.js";
import ScheduledGuildEvent from "../../models/ScheduledGuildEvent";
import { GuildEventRecurrence } from "../../utils/constants";

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
                    if (!event.description) {
                        const msUntilEvent =
                            event.nextOccurrence.getTime() - now.getTime();
                        const minutesUntilEvent = Math.round(msUntilEvent / 60000);

                        const creator = await client.users.fetch(event.creatorId);

                        const openLinkModalButton = new ButtonBuilder()
                            .setCustomId(`open-link-modal::${event.eventId}`)
                            .setLabel("Provide Event Description and Link")
                            .setStyle(ButtonStyle.Primary);

                        const row =
                            new ActionRowBuilder<ButtonBuilder>().addComponents(
                                openLinkModalButton,
                            );

                        await creator.send({
                            content: `Reminder: Your event "${event.name}" is starting in ${minutesUntilEvent} minute(s). Please provide the event description, and a custom link if any, by clicking the button below.`,
                            components: [row],
                        });
                    }
                } catch (error) {
                    console.error(
                        `Failed to send reminder for event "${event.name}":`,
                        error,
                    );
                }

                if (event.recurrence != GuildEventRecurrence["Does not repeat"]) {
                    // todo: fix this
                    // const nextOccurrence = calculateNextOccurrence(
                    //     event.scheduledStartsAt,
                    //     event.recurrence as keyof typeof GuildEventRecurrence,
                    // );
                    // await ScheduledGuildEvent.updateOne(
                    //     { _id: event._id },
                    //     { nextOccurrence, $unset: { lastReminderSent: "" } },
                    // );
                }
            });
        } catch (error) {
            console.error(`Error scheduling event reminders:\n`, error);
        }
    }
}
