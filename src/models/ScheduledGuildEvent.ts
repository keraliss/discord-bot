import mongoose from "mongoose";
import { GuildEventRecurrence } from "../utils/constants";

const scheduledEventSchema = new mongoose.Schema(
    {
        eventId: {
            type: String,
            required: true,
        },
        creatorId: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        scheduledStartsAt: {
            type: Date,
            required: true,
        },
        recurrence: {
            type: String,
            required: true,
            enum: Object.values(GuildEventRecurrence),
            default: GuildEventRecurrence.None,
        },
    },
    { timestamps: true },
);

const ScheduledGuildEvent = mongoose.model(
    "ScheduledGuildEvent",
    scheduledEventSchema,
);
export default ScheduledGuildEvent;
