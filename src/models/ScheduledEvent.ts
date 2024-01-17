import mongoose from "mongoose";

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
    },
    { timestamps: true },
);

const ScheduledEvent = mongoose.model("ScheduledEvent", scheduledEventSchema);
export default ScheduledEvent;