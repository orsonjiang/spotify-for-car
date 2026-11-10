// Input validation shared by the data layer, Server Actions and auth Route Handlers.
// Everything that arrives from the client (params, Server Action arguments, query strings) goes through here.
import 'server-only';

const TRACK_ID = /^[A-Za-z0-9]{22}$/;
const PLAYLIST_ID = /^[A-Za-z0-9]{1,64}$/;
const CONTROL_CHARS = /[\u0000-\u001f\u007f]/;

export const MAX_ROOM_URL_LENGTH = 64;
export const MAX_QUERY_LENGTH = 100;

export function isValidRoomUrl(roomUrl) {
	return typeof roomUrl === 'string' && roomUrl.length > 0 && roomUrl.length <= MAX_ROOM_URL_LENGTH;
}

// Returns the trimmed query, or null when it is empty, too long or not a string.
export function normalizeQuery(query) {
	if (typeof query !== 'string') return null;
	const trimmed = query.trim();
	if (!trimmed || trimmed.length > MAX_QUERY_LENGTH) return null;
	return trimmed;
}

export function isValidTrackId(trackId) {
	return typeof trackId === 'string' && TRACK_ID.test(trackId);
}

export function isValidPlaylistId(playlistId) {
	return playlistId === 'liked' || (typeof playlistId === 'string' && PLAYLIST_ID.test(playlistId));
}

// Only same-origin paths are allowed as post-login/logout destinations (blocks open redirects such as
// `//evil.com`, `/\evil.com` or `https://evil.com`). Anything else becomes `/`.
export function safeRedirectPath(location) {
	if (typeof location !== 'string' || location.length > 512) return '/';
	if (!location.startsWith('/') || location.startsWith('//') || location.includes('\\')) return '/';
	if (CONTROL_CHARS.test(location)) return '/';
	try {
		const base = 'http://same-origin.invalid';
		const url = new URL(location, base);
		if (url.origin !== base) return '/';
		// Never bounce back into the auth handlers (e.g. login → logout loops).
		if (url.pathname === '/api/auth' || url.pathname.startsWith('/api/auth/')) return '/';
		return url.pathname + url.search + url.hash;
	} catch {
		return '/';
	}
}
