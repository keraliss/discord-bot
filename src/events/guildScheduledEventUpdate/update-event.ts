import { GuildScheduledEvent } from "discord.js";
import ScheduledGuildEvent, {
    calculateNextOccurrence,
} from "../../models/ScheduledGuildEvent";
import { SystemEvents, systemEventEmitter } from "../../utils/event-emitter";
import { GuildEventRecurrence } from "../../utils/constants";

export default async function (
    _oldGuildEvent: GuildScheduledEvent,
    newGuildEvent: GuildScheduledEvent,
) {
    const eventInDb = await ScheduledGuildEvent.findOne({
        eventId: newGuildEvent.id,
    });

    const newNexOccurrence = calculateNextOccurrence(
        newGuildEvent.scheduledStartAt,
        eventInDb.recurrence as keyof typeof GuildEventRecurrence,
    );

    await ScheduledGuildEvent.findOneAndUpdate(
        { eventId: newGuildEvent.id },
        {
            eventId: newGuildEvent.id,
            creatorId: newGuildEvent.creatorId,
            name: newGuildEvent.name,
            guildId: newGuildEvent.guildId,
            scheduledStartsAt: new Date(newGuildEvent.scheduledStartTimestamp!),
            nextOccurrence: newNexOccurrence,
        },
        {
            upsert: true,
        },
    );

    systemEventEmitter.emit(SystemEvents.GuildEventUpdated, newGuildEvent, true);
}
