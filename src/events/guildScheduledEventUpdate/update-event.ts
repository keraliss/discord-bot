import { GuildScheduledEvent } from "discord.js";
import ScheduledEvent from "../../models/ScheduledEvent";

export default async function (
    _oldGuildEvent: GuildScheduledEvent,
    newGuildEvent: GuildScheduledEvent,
) {
    await ScheduledEvent.findOneAndUpdate(
        { eventId: newGuildEvent.id },
        {
            name: newGuildEvent.name,
            scheduledStartsAt: new Date(newGuildEvent.scheduledStartTimestamp!),
        },
    );
}
