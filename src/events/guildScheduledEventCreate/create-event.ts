import { GuildScheduledEvent } from "discord.js";
import ScheduledEvent from "../../models/ScheduledEvent";

export default async function (event: GuildScheduledEvent) {
    if (!event.scheduledStartTimestamp) {
        return; // Don't need to do anything with events that start immediately
    }

    await ScheduledEvent.create({
        creatorId: event.creatorId,
        eventId: event.id,
        name: event.name,
        scheduledStartsAt: new Date(event.scheduledStartTimestamp),
    });
};
