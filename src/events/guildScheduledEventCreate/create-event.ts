import { GuildScheduledEvent } from "discord.js";
import ScheduledGuildEvent from "../../models/ScheduledGuildEvent";
import { SystemEvents, systemEventEmitter } from "../../utils/event-emitter";

export default async function (guildEvent: GuildScheduledEvent) {
    if (!guildEvent.scheduledStartTimestamp) {
        return; // Don't need to do anything with events that start immediately
    }

    try {
        await ScheduledGuildEvent.create({
            eventId: guildEvent.id,
            creatorId: guildEvent.creatorId,
            guildId: guildEvent.guildId,
            name: guildEvent.name,
            scheduledStartsAt: new Date(guildEvent.scheduledStartTimestamp),
        });

        systemEventEmitter.emit(SystemEvents.GuildEventCreated, guildEvent);
    } catch (e) {
        console.error(e);
    }
}
