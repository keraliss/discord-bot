const mongoose = require("mongoose");

const registerConfigSchema = mongoose.Schema(
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
    { timestamp: true },
);

module.exports = mongoose.model("RegisterConfig", registerConfigSchema);
