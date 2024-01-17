import { GuildScheduledEvent } from "discord.js";
import ScheduledEvent from "../../models/ScheduledEvent";

export default async function (_oldEvent: GuildScheduledEvent, newEvent: GuildScheduledEvent) {
    await ScheduledEvent.findOneAndUpdate({ eventId: newEvent.id }, {
        name: newEvent.name,
        scheduledStartsAt: new Date(newEvent.scheduledStartTimestamp!),
    });
};
