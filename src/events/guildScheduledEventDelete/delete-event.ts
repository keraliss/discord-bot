import { GuildScheduledEvent } from "discord.js";
import ScheduledEvent from "../../models/ScheduledEvent";

export default async function (guildEvent: GuildScheduledEvent) {
    await ScheduledEvent.deleteOne({ eventId: guildEvent.id });
}
