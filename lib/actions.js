'use server';

// Server Actions called from Client Components. Every export is a public POST endpoint, so inputs are validated
// here (and again in the data layer) and nothing throws for expected failures. Rooms are public by design: anyone
// with the room URL can read the owner's queue and add songs (same as the old API), so no session is required.
import { addTrackToRoomQueue, getRoomQueue, searchRoomTracks } from './data.js';
import { isValidRoomUrl, isValidTrackId, normalizeQuery } from './validate.js';

// → Queue | null
export async function fetchQueue(roomUrl) {
	if (!isValidRoomUrl(roomUrl)) return null;
	try {
		return await getRoomQueue(roomUrl);
	} catch (err) {
		console.error(`fetchQueue failed: ${err?.message ?? err}`);
		return null;
	}
}

// → Track[] ([] for an empty/invalid query or on errors)
export async function searchTracks(roomUrl, query) {
	const q = normalizeQuery(query);
	if (!isValidRoomUrl(roomUrl) || !q) return [];
	try {
		return await searchRoomTracks(roomUrl, q);
	} catch (err) {
		console.error(`searchTracks failed: ${err?.message ?? err}`);
		return [];
	}
}

// → { ok: true, queue: Queue | null } | { ok: false, error: string }
// error is one of 'demo' (the UI adds to its local demo queue instead), 'invalid_room', 'invalid_track',
// 'room_not_found', 'add_failed' (e.g. no active Spotify device), 'server_error'.
export async function addTrackToQueue(roomUrl, trackId) {
	if (!isValidRoomUrl(roomUrl)) return { ok: false, error: 'invalid_room' };
	if (roomUrl === 'demo') return { ok: false, error: 'demo' };
	if (!isValidTrackId(trackId)) return { ok: false, error: 'invalid_track' };
	try {
		return await addTrackToRoomQueue(roomUrl, trackId);
	} catch (err) {
		console.error(`addTrackToQueue failed: ${err?.message ?? err}`);
		return { ok: false, error: 'server_error' };
	}
}
