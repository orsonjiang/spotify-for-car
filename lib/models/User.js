import 'server-only';
import mongoose from 'mongoose';

// Same model name, collection (`users`) and fields as server/models/user-model.js so existing documents keep working.
const UserSchema = new mongoose.Schema(
	{
		displayName: { type: String, required: true },
		spotifyId: { type: String, required: true },
		accessToken: { type: String, required: true },
		refreshToken: { type: String, required: true },
		expiresIn: { type: Date, required: true },
		url: { type: String, required: true },
		picture_url: { type: String, required: false },
	},
	{ timestamps: true },
);

// Reuse the compiled model across HMR re-evaluations (mongoose throws OverwriteModelError otherwise).
const User = mongoose.models.User ?? mongoose.model('User', UserSchema);

export default User;
