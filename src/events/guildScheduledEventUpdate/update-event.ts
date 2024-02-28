import { GuildScheduledEvent } from "discord.js";
import ScheduledGuildEvent from "../../models/ScheduledGuildEvent";
import { SystemEvents, systemEventEmitter } from "../../utils/event-emitter";

export default async function (
    _oldGuildEvent: GuildScheduledEvent,
    newGuildEvent: GuildScheduledEvent,
) {
    await ScheduledGuildEvent.findOneAndUpdate(
        { eventId: newGuildEvent.id },
        {
            name: newGuildEvent.name,
            scheduledStartsAt: new Date(newGuildEvent.scheduledStartTimestamp!),
            creatorId: newGuildEvent.creatorId,
            eventId: newGuildEvent.id,
        },
        {
            upsert: true,
        },
    );

    systemEventEmitter.emit(SystemEvents.GuildEventUpdated, newGuildEvent, true);
}
