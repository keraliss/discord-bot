import mongoose from "mongoose";

const registerConfigSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        token: {
            type: String,
        },
        enrolled: {
            type: Boolean,
        },
        channel: {
            type: String,
        },
    },
    { timestamps: true },
);

const RegisterConfig = mongoose.model("RegisterConfig", registerConfigSchema);
export default RegisterConfig;