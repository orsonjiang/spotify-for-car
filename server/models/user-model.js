const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        displayName: { type: String, required: true },
        spotifyId: { type: String, required: true },
        accessToken: { type: String, required: true },
        refreshToken: { type: String, required: true },
        expiresIn: { type: Date, required: true },
        url: { type: String, required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
