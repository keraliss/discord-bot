import EventEmitter from "events";
export const systemEventEmitter = new EventEmitter();

export const SystemEvents = {
    GuildEventCreated: "guild-event-created",
    GuildEventUpdated: "guild-event-updated",
    GuildEventRecurrenceUpdated: "guild-event-recurrence-updated",
};
