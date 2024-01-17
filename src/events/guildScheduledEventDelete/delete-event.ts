import { GuildScheduledEvent } from "discord.js";
import ScheduledEvent from "../../models/ScheduledEvent";

export default async function (event: GuildScheduledEvent) {
    await ScheduledEvent.deleteOne({ eventId: event.id });
};
