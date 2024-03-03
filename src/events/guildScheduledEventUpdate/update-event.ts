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
            eventId: newGuildEvent.id,
            creatorId: newGuildEvent.creatorId,
            name: newGuildEvent.name,
            guildId: newGuildEvent.guildId,
            scheduledStartsAt: new Date(newGuildEvent.scheduledStartTimestamp!),
        },
        {
            upsert: true,
        },
    );

    systemEventEmitter.emit(SystemEvents.GuildEventUpdated, newGuildEvent, true);
}
