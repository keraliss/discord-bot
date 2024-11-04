import mongoose from "mongoose";

const devFormConfigSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        github: {
            type: String,
            default: "",
        },
        linkedIn: {
            type: String,
            default: "",
        },
        contributions: { type: [String], default: [] },
        project: {
            type: String,
            default: "",
        },
        whyPassionate: {
            type: String,
            default: "",
        },
        employmentStatus: { type: [String], default: [] },
        education: { type: [String], default: [] },
        lookingForFullTime: { type: [String], default: [] },
        interest: { type: [String], default: [] },
        technical: {
            type: String,
            default: "",
        },
        hours: {
            type: String,
            default: "",
        },
        achieve: {
            type: String,
            default: ""
        },
        email: {
            type: String,
            default: "",
        }
    },
    { timestamps: true },
);



const DevFormConfig = mongoose.model("DevFormConfig", devFormConfigSchema);
export default DevFormConfig;