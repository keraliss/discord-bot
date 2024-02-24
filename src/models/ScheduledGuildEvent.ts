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
            // required: true,
            enum: Object.values(GuildEventRecurrence),
            default: GuildEventRecurrence["Does not repeat"],
        },
        nextOccurrence: {
            type: Date,
            // required: true,
        },
        lastReminderSent: {
            type: Date,
        },
    },
    { timestamps: true },
);

scheduledEventSchema.pre("save", function (next) {
    this.nextOccurrence = calculateNextOccurrence(
        this.scheduledStartsAt,
        this.recurrence as keyof typeof GuildEventRecurrence,
    );
    next();
});

export function calculateNextOccurrence(
    startDate: Date,
    recurrence: keyof typeof GuildEventRecurrence,
): Date {
    const nextOccurrence = new Date(startDate);
    const now = new Date();

    if (recurrence === GuildEventRecurrence["Does not repeat"]) {
        return nextOccurrence;
    }

    while (nextOccurrence <= now) {
        switch (recurrence) {
            case GuildEventRecurrence.Daily:
                nextOccurrence.setDate(nextOccurrence.getDate() + 1);
                break;
            case GuildEventRecurrence.Weekly:
                nextOccurrence.setDate(nextOccurrence.getDate() + 7);
                break;
            case GuildEventRecurrence["Every other week"]:
                nextOccurrence.setDate(nextOccurrence.getDate() + 14);
                break;
            case GuildEventRecurrence.Monthly:
                nextOccurrence.setMonth(nextOccurrence.getMonth() + 1);
                break;
            case GuildEventRecurrence.Annually:
                nextOccurrence.setFullYear(nextOccurrence.getFullYear() + 1);
                break;
            case GuildEventRecurrence["Monday to Friday"]:
                // Move to the next day
                nextOccurrence.setDate(nextOccurrence.getDate() + 1);
                // If it's Saturday, add two more days to move to Monday
                if (nextOccurrence.getDay() === 6) {
                    nextOccurrence.setDate(nextOccurrence.getDate() + 2);
                }
                // If it's Sunday, add one more day to move to Monday
                else if (nextOccurrence.getDay() === 0) {
                    nextOccurrence.setDate(nextOccurrence.getDate() + 1);
                }
                break;
            default:
                // This default case handles unexpected values by not altering the next occurrence.
                console.warn(`Unsupported recurrence pattern: ${recurrence}`);
                return nextOccurrence;
        }
    }

    return nextOccurrence;
}

const ScheduledGuildEvent = mongoose.model(
    "ScheduledGuildEvent",
    scheduledEventSchema,
);
export default ScheduledGuildEvent;
