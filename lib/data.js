// Data Access Layer for Server Components (and the Server Actions in lib/actions.js).
// Reads cookies / MongoDB / Spotify at request time; returns plain slim objects (see SPEC "Data shapes") and
// null instead of throwing for expected failures. Room-scoped Spotify calls (queue, search, add) use the ROOM
// OWNER's account (search falls back to an app token; demo search uses only the app token); library calls use the
// VIEWER's account.
import 'server-only';
import mongoose from 'mongoose';
import { connection } from 'next/server';
import { cache } from 'react';
import { connectDb } from './db.js';
import {
	DEMO_ROOM_URL,
	getDemoPlaylist,
	getDemoPlaylists,
	getDemoQueue,
	getDemoRoom,
	getDemoViewer,
} from './demo.js';
import User from './models/User.js';
import { getSessionUserId } from './session.js';
import { LIKED_SONGS_ID, LIKED_SONGS_NAME, likedSongsPlaylist } from './shapes.js';
import * as spotify from './spotify.js';
import { isValidPlaylistId, isValidRoomUrl, isValidTrackId, normalizeQuery } from './validate.js';

const USER_FIELDS = 'displayName spotifyId accessToken refreshToken expiresIn url picture_url';

/* ------------------------------ user lookups ------------------------------ */
// Wrapped in React `cache` so a layout and its page share one DB round trip per request. The returned lean
// documents hold tokens: they never leave this module except through the slim converters below.

// `connection()` marks everything after it as request-time: Mongoose, jose and the Spotify token checks read the
// clock (`new Date()`), which Cache Components rejects while prerendering. It resolves immediately inside a real
// request or Server Action.
const findUserByUrl = cache(async (url) => {
	await connection();
	try {
		await connectDb();
		return await User.findOne({ url }, USER_FIELDS).lean();
	} catch (err) {
		console.error(`Failed to load room "${url}": ${err?.message ?? err}`);
		return null;
	}
});

const findSessionUser = cache(async () => {
	await connection();
	const userId = await getSessionUserId();
	if (!userId || !mongoose.isValidObjectId(userId)) return null;
	try {
		await connectDb();
		return await User.findById(userId, USER_FIELDS).lean();
	} catch (err) {
		console.error(`Failed to load session user: ${err?.message ?? err}`);
		return null;
	}
});

function toRoom(user) {
	return {
		url: user.url,
		displayName: user.displayName,
		pictureUrl: user.picture_url || null,
		ownerId: user.spotifyId,
	};
}

function toViewer(user) {
	return {
		id: user.spotifyId,
		displayName: user.displayName,
		url: user.url,
		pictureUrl: user.picture_url || null,
	};
}

/* ---------------------------- contract functions --------------------------- */

// → Room | null
export async function getRoom(roomUrl) {
	if (!isValidRoomUrl(roomUrl)) return null;
	if (roomUrl === DEMO_ROOM_URL) return getDemoRoom();
	const owner = await findUserByUrl(roomUrl);
	return owner ? toRoom(owner) : null;
}

// → Viewer | null (the demo room always has the demo viewer)
export async function getViewer(roomUrl) {
	if (!isValidRoomUrl(roomUrl)) return null;
	if (roomUrl === DEMO_ROOM_URL) return getDemoViewer();
	const user = await findSessionUser();
	return user ? toViewer(user) : null;
}

// → Queue | null
export async function getRoomQueue(roomUrl) {
	if (!isValidRoomUrl(roomUrl)) return null;
	if (roomUrl === DEMO_ROOM_URL) return getDemoQueue();
	const owner = await findUserByUrl(roomUrl);
	if (!owner) return null;
	return spotify.getQueue(owner);
}

// → Playlist[] (Liked Songs first) | null when not logged in
export async function getViewerPlaylists(roomUrl) {
	if (!isValidRoomUrl(roomUrl)) return null;
	if (roomUrl === DEMO_ROOM_URL) return getDemoPlaylists();
	const viewer = await findSessionUser();
	if (!viewer) return null;
	// A Spotify failure still shows Liked Songs (null is reserved for "not logged in").
	const playlists = (await spotify.getMyPlaylists(viewer)) ?? [];
	return [likedSongsPlaylist(), ...playlists];
}

// → PlaylistDetail | null
export async function getViewerPlaylist(roomUrl, playlistId) {
	if (!isValidRoomUrl(roomUrl) || !isValidPlaylistId(playlistId)) return null;
	if (roomUrl === DEMO_ROOM_URL) return getDemoPlaylist(playlistId);
	const viewer = await findSessionUser();
	if (!viewer) return null;

	if (playlistId === LIKED_SONGS_ID) {
		const tracks = await spotify.getSavedTracks(viewer);
		return tracks ? { id: LIKED_SONGS_ID, name: LIKED_SONGS_NAME, tracks } : null;
	}

	const [name, tracks] = await Promise.all([
		spotify.getPlaylistName(viewer, playlistId),
		spotify.getPlaylistTracks(viewer, playlistId),
	]);
	return name !== null && tracks ? { id: playlistId, name, tracks } : null;
}

/* ------------------------- used by lib/actions.js -------------------------- */

// → Track[]. 'demo' searches with the app (client-credentials) token and never touches the DB; real rooms use the
// owner's token, falling back to the app token when the owner's token is unusable.
export async function searchRoomTracks(roomUrl, query) {
	const q = normalizeQuery(query);
	if (!isValidRoomUrl(roomUrl) || !q) return [];
	if (roomUrl === DEMO_ROOM_URL) return (await spotify.searchTracksAsApp(q)) ?? [];
	const owner = await findUserByUrl(roomUrl);
	if (!owner) return [];
	return (await spotify.searchTracks(owner, q)) ?? [];
}

// → { ok: true, queue } | { ok: false, error }
// error: 'demo' | 'invalid_room' | 'invalid_track' | 'room_not_found' | 'add_failed'
export async function addTrackToRoomQueue(roomUrl, trackId) {
	if (!isValidRoomUrl(roomUrl)) return { ok: false, error: 'invalid_room' };
	if (roomUrl === DEMO_ROOM_URL) return { ok: false, error: 'demo' };
	if (!isValidTrackId(trackId)) return { ok: false, error: 'invalid_track' };

	const owner = await findUserByUrl(roomUrl);
	if (!owner) return { ok: false, error: 'room_not_found' };
	if (!(await spotify.addToQueue(owner, trackId))) return { ok: false, error: 'add_failed' };

	return { ok: true, queue: await spotify.getQueue(owner) };
}
