import { Client } from "discord.js";
import ScheduledGuildEvent, {
    calculateNextOccurrence,
} from "../../models/ScheduledGuildEvent";
import { GuildEventRecurrence } from "../../utils/constants";

export default function scheduleEventReminders(client: Client) {
    checkForUpcomingEvents();

    setInterval(checkForUpcomingEvents, 60000 * 5);

    async function checkForUpcomingEvents() {
        try {
            const now = new Date();
            const upcomingEvents = await ScheduledGuildEvent.find({
                nextOccurrence: {
                    $lte: new Date(now.getTime() + 30 * 60000), // within the next 30 minutes
                    $gt: now, // not already started
                },
            });

            upcomingEvents.forEach(async (event) => {
                try {
                    const msUntilEvent =
                        event.nextOccurrence.getTime() - now.getTime();
                    const minutesUntilEvent = Math.round(msUntilEvent / 60000);

                    const creator = await client.users.fetch(event.creatorId);
                    await creator.send(
                        `Reminder: Your event "${event.name}" is starting in ${minutesUntilEvent} minute(s).`,
                    );
                } catch (error) {
                    console.error(
                        `Failed to send reminder for event "${event.name}":`,
                        error,
                    );
                }

                // const targetGuild =
                //     client.guilds.cache.get(event.guildId) ||
                //     (await client.guilds.fetch(event.guildId).catch(console.error));
                // if (!targetGuild) return;
                //
                // const targetChannel =
                //     (targetGuild.channels.cache.get(
                //         event.notificationChannelId,
                //     ) as TextChannel) ||
                //     ((await targetGuild.channels
                //         .fetch(event.notificationChannelId)
                //         .catch(console.error)) as TextChannel);
                // if (!targetChannel || !targetChannel.isText()) return;
                //
                // targetChannel.send(
                //     `Reminder: Event "${event.name}" is starting soon.`,
                // );

                if (event.recurrence != GuildEventRecurrence["Does not repeat"]) {
                    const nextOccurrence = calculateNextOccurrence(
                        event.scheduledStartsAt,
                        event.recurrence as keyof typeof GuildEventRecurrence,
                    );

                    ScheduledGuildEvent.updateOne(
                        {
                            eventId: event.eventId,
                        },
                        {
                            nextOccurrence,
                        },
                    );
                }
            });
        } catch (error) {
            console.error(`Error scheduling event reminders:\n`, error);
        }
    }
}
