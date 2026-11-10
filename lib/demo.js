// Demo-room data from the bundled fixtures, slimmed through the same helpers as real Spotify responses so the UI
// gets identical shapes. Fixtures are imported as JSON modules (bundled, no fs reads at runtime).
import 'server-only';
import libraryFixture from './demo/fixtures/myLibrary.json' with { type: 'json' };
import playlistCacheFixture from './demo/fixtures/playlistCache.json' with { type: 'json' };
import queueFixture from './demo/fixtures/queue.json' with { type: 'json' };
import roomFixture from './demo/fixtures/room.json' with { type: 'json' };
import userFixture from './demo/fixtures/user.json' with { type: 'json' };
import { LIKED_SONGS_ID, LIKED_SONGS_NAME, likedSongsPlaylist, slimPlaylists, slimQueue, slimTrackItems } from './shapes.js';

export const DEMO_ROOM_URL = 'demo';

// Slimmed lazily, once per process; callers get deep copies so nothing can mutate the shared cache.
let queueCache;
let playlistsCache;
const playlistTracksCache = new Map();

export function getDemoRoom() {
	return {
		url: DEMO_ROOM_URL,
		displayName: roomFixture.displayName,
		pictureUrl: roomFixture.picture_url || null,
		ownerId: roomFixture.owner_id,
	};
}

export function getDemoViewer() {
	return {
		id: userFixture.id,
		displayName: userFixture.displayName,
		url: userFixture.url,
		pictureUrl: userFixture.picture_url || null,
	};
}

// → Queue
export function getDemoQueue() {
	queueCache ??= slimQueue(queueFixture);
	return structuredClone(queueCache);
}

// → Playlist[] (Liked Songs first)
export function getDemoPlaylists() {
	playlistsCache ??= slimPlaylists(libraryFixture.items);
	return [likedSongsPlaylist(), ...structuredClone(playlistsCache)];
}

// → PlaylistDetail | null
export function getDemoPlaylist(playlistId) {
	if (!Object.hasOwn(playlistCacheFixture, playlistId)) return null;

	let name = LIKED_SONGS_NAME;
	if (playlistId !== LIKED_SONGS_ID) {
		const playlist = libraryFixture.items.find((item) => item?.id === playlistId);
		if (!playlist) return null;
		name = playlist.name;
	}

	if (!playlistTracksCache.has(playlistId)) {
		playlistTracksCache.set(playlistId, slimTrackItems(playlistCacheFixture[playlistId]));
	}
	return { id: playlistId, name, tracks: structuredClone(playlistTracksCache.get(playlistId)) };
}
