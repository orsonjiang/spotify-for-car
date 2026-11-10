// Helpers shared by the Spotify OAuth Route Handlers in app/api/auth/*.
import 'server-only';
import { connectDb } from './db.js';
import User from './models/User.js';
import { secureCookies } from './session.js';

export const OAUTH_STATE_COOKIE = 'oauth_state';
export const OAUTH_STATE_MAX_AGE = 10 * 60; // seconds
export const OAUTH_STATE_PATH = '/api/auth';

// Public origin of the app: APP_URL when set (needed behind proxies), else the request's own origin.
export function getAppOrigin(request) {
	const appUrl = process.env.APP_URL;
	if (appUrl) {
		try {
			return new URL(appUrl).origin;
		} catch {
			console.error('APP_URL is not a valid URL; falling back to the request origin');
		}
	}
	return request.nextUrl.origin;
}

export function getRedirectUri(request) {
	return `${getAppOrigin(request)}/api/auth/callback`;
}

// Short-lived, httpOnly cookie holding { state, location } between /login and /callback.
export function stateCookieOptions(appOrigin) {
	return {
		httpOnly: true,
		sameSite: 'lax',
		secure: secureCookies(appOrigin),
		path: OAUTH_STATE_PATH,
		maxAge: OAUTH_STATE_MAX_AGE,
	};
}

// Creates the user on first login (url = spotifyId) or refreshes tokens + profile of an existing one.
// → lean user document ({ _id, url, ... }) | null
export async function upsertSpotifyUser(tokens, profile) {
	const set = {
		displayName: profile.displayName,
		picture_url: profile.pictureUrl,
		accessToken: tokens.accessToken,
		expiresIn: tokens.expiresIn,
	};
	// Spotify always returns a refresh token for the code grant. If it ever does not, keep the stored one and
	// refuse to create a user that could never refresh.
	if (tokens.refreshToken) set.refreshToken = tokens.refreshToken;

	try {
		await connectDb();
		return await User.findOneAndUpdate(
			{ spotifyId: profile.id },
			{ $set: set, $setOnInsert: { url: profile.id } },
			{
				upsert: Boolean(tokens.refreshToken),
				returnDocument: 'after',
				runValidators: true,
				setDefaultsOnInsert: true,
				lean: true,
			},
		);
	} catch (err) {
		console.error(`Failed to save Spotify user: ${err?.message ?? err}`);
		return null;
	}
}
