import mongoose from "mongoose";

const eduFormConfigSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        program: {
            type: String,
            default: "",
        },
        duration: {
            type: String,
            default: "",
        },
        impact: {
            type: String,
            default: "",
        },
        operationalSupport: {
            type: String,
            default: "",
        },
        status: {
            type: String,
            default: "",
        },
        employmentStatus: { type: [String], default: [] },
        education: { type: [String], default: [] },
        lookingForFullTime: { type: [String], default: [] },
        interest: { type: [String], default: [] },
        teachingExperience: {
            type: String,
            default: "",
        },
        communityEngagement: {
            type: String,
            default: "",
        },
        achieve: {
            type: String,
            default: "",
        },
        email: {
            type: String,
            default: "",
        }
    },
    { timestamps: true },
);

const EduFormConfig = mongoose.model("EduFormConfig", eduFormConfigSchema);
export default EduFormConfig;
