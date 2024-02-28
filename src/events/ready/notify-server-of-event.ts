import { Client } from "discord.js";
import ScheduledGuildEvent from "../../models/ScheduledGuildEvent";

const FIFTEEN_MINUTES_IN_MS = 60000 * 15;
const FIVE_MINUTES_IN_MS = 60000 * 5;

export default function notifyServerOfEvent(client: Client) {
    checkForUpcomingEvents();

    setInterval(checkForUpcomingEvents, FIVE_MINUTES_IN_MS);

    async function checkForUpcomingEvents() {
        try {
            const now = new Date();
            const upcomingEvents = await ScheduledGuildEvent.find({
                nextOccurrence: {
                    $lte: new Date(now.getTime() + FIFTEEN_MINUTES_IN_MS),
                    $gt: now,
                },
                notifiedToServer: { $ne: true },
                deletedAt: null,
            });

            upcomingEvents.forEach(async (event) => {
                if (!event.targetChannelId) {
                    console.warn(
                        `No target channel configured for ${event.name}, skipping sending reminder to server`,
                    );
                    return;
                }

                try {
                    const targetChannel = await client.channels.fetch(
                        event.targetChannelId,
                    );
                    if (!targetChannel || !targetChannel.isTextBased()) {
                        console.error(
                            "Target channel not found or is not text-based.",
                        );
                        return;
                    }

                    const minutesUntilEvent = Math.round(
                        (event.nextOccurrence.getTime() - now.getTime()) / 60000,
                    );
                    const messageContent =
                        `Hey all, the event "${event.name}" is starting in ${minutesUntilEvent} minute(s)!` +
                        `${
                            event.customLink
                                ? `\nHere's the link to join: ${event.customLink}`
                                : ""
                        }`;

                    await targetChannel.send(messageContent);

                    await ScheduledGuildEvent.updateOne(
                        { _id: event._id },
                        { $set: { notifiedToServer: true } },
                    );
                } catch (error) {
                    console.error(
                        `Failed to send notification for event "${event.name}":`,
                        error,
                    );
                }
            });
        } catch (error) {
            console.error("Error notifying server of event:", error);
        }
    }
}
