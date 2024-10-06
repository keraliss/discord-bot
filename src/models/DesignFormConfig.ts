import mongoose from "mongoose";

const designFormConfigSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        portfolio: {
            type: String,
            default: "",
        },
        whyPassionate: {
            type: String,
            default: "",
        },
        employmentStatus: { type: [String], default: [] },
        education: { type: [String], default: [] },
        project: {
            type: String,
            default: "",
        },
        linkedIn: {
            type: String,
            default: "",
        },
        achieve: {
            type: String,
            default: "",
        },
        github: {
            type: String,
            default: "",
        },
        describeSkills: {
            type: String,
            default: "",
        },
        contributedBefore: {
            type: String,
            default: "",
        },
        hours: {
            type: String,
            default: "",
        },
    },
    { timestamps: true },
);


const DesignFormConfig = mongoose.model("DesignFormConfig", designFormConfigSchema);
export default DesignFormConfig;
