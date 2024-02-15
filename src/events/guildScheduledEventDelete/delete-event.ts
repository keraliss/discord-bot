import { GuildScheduledEvent } from "discord.js";
import ScheduledGuildEvent from "../../models/ScheduledGuildEvent";

export default async function (guildEvent: GuildScheduledEvent) {
    await ScheduledGuildEvent.deleteOne({ eventId: guildEvent.id });
}
