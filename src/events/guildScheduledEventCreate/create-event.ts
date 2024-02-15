import { GuildScheduledEvent } from "discord.js";
import ScheduledEvent from "../../models/ScheduledEvent";
import { SystemEvents, systemEventEmitter } from "../../utils/event-emitter";

export default async function (guildEvent: GuildScheduledEvent) {
    if (!guildEvent.scheduledStartTimestamp) {
        return; // Don't need to do anything with events that start immediately
    }

    try {
        await ScheduledEvent.create({
            creatorId: guildEvent.creatorId,
            eventId: guildEvent.id,
            name: guildEvent.name,
            scheduledStartsAt: new Date(guildEvent.scheduledStartTimestamp),
        });

        systemEventEmitter.emit(SystemEvents.GuildEventCreated, {
            eventId: guildEvent.id,
            eventName: guildEvent.name,
            creatorId: guildEvent.creatorId,
        });
    } catch (e) {
        console.error(e);
    }
}
