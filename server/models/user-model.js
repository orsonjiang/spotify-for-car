const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        displayName: { type: String, required: true },
        email: { type: String, required: true },
        id: { type: String, required: true },
        refreshToken: { type: String, required: true },
        url: { type: String, required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
