import mongoose from "mongoose";

const scheduledGuildEventSchema = new mongoose.Schema(
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
            enum: ["daily", "weekly", "monthly", "none"],
            default: "none",
        },
    },
    { timestamps: true },
);

const ScheduledGuildEvent = mongoose.model(
    "ScheduledGuildEvent",
    scheduledGuildEventSchema,
);
export default ScheduledGuildEvent;
