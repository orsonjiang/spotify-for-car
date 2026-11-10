// Fetch-based Spotify Web API client. User-scoped functions take a user record (lean User document: _id,
// accessToken, refreshToken, expiresIn, ...); searchTracksAsApp uses an app-only token. All return slim shapes from
// lib/shapes.js, or null/false on failure.
// Failures are logged with method + path + status only; tokens and response bodies are never logged.
import 'server-only';
import { connectDb } from './db.js';
import User from './models/User.js';
import { slimPlaylists, slimQueue, slimTrackItems, slimTracks } from './shapes.js';

const API_BASE = 'https://api.spotify.com/v1';
const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const REQUEST_TIMEOUT_MS = 10_000;
const REFRESH_MARGIN_MS = 60_000; // refresh when the access token expires within a minute
const PAGE_CONCURRENCY = 4;
const MAX_TRACKS = 10_000; // Spotify's playlist size limit; also caps runaway Liked Songs pagination

// Only what the UI needs from playlist items (cuts the payload of big playlists by ~10x).
const PLAYLIST_ITEM_FIELDS = 'total,limit,items(track(id,name,uri,artists(name),album(name,images,artists(name))))';

export const SPOTIFY_SCOPES = [
	'user-read-playback-state',
	'user-modify-playback-state',
	'user-read-private',
	'playlist-read-private',
	'playlist-read-collaborative',
	'user-library-read',
].join(' ');

/* -------------------------------------------------------------------------- */
/* Tokens                                                                      */
/* -------------------------------------------------------------------------- */

function clientAuthHeader() {
	const { CLIENT_ID, CLIENT_SECRET } = process.env;
	if (!CLIENT_ID || !CLIENT_SECRET) throw new Error('CLIENT_ID / CLIENT_SECRET are not set');
	return `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`;
}

// POST to the accounts token endpoint → parsed JSON or null.
async function requestToken(params, label) {
	let res;
	try {
		res = await fetch(TOKEN_URL, {
			method: 'POST',
			headers: {
				Authorization: clientAuthHeader(),
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams(params),
			signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
		});
	} catch (err) {
		console.error(`Spotify ${label} failed: ${err?.name ?? 'Error'}`);
		return null;
	}
	if (!res.ok) {
		let code = '';
		try {
			code = (await res.json())?.error ?? '';
		} catch {}
		console.error(`Spotify ${label} failed with status ${res.status}${code ? ` (${code})` : ''}`);
		return null;
	}
	const data = await res.json().catch(() => null);
	if (!data?.access_token || !Number.isFinite(data.expires_in)) {
		console.error(`Spotify ${label} returned an unexpected body`);
		return null;
	}
	return data;
}

// Authorization-code exchange for the OAuth callback → { accessToken, refreshToken, expiresIn: Date } | null
export async function exchangeCodeForTokens(code, redirectUri) {
	const data = await requestToken(
		{ grant_type: 'authorization_code', code, redirect_uri: redirectUri },
		'authorization code exchange',
	);
	if (!data) return null;
	return {
		accessToken: data.access_token,
		refreshToken: data.refresh_token ?? null,
		expiresIn: new Date(Date.now() + data.expires_in * 1000),
	};
}

const inflightRefreshes = new Map(); // user id → Promise<update | null> (dedupes refreshes within this process)

async function refreshAccessToken(user) {
	if (!user.refreshToken) return null;
	const data = await requestToken({ grant_type: 'refresh_token', refresh_token: user.refreshToken }, 'token refresh');
	if (!data) return null;

	const update = {
		accessToken: data.access_token,
		expiresIn: new Date(Date.now() + data.expires_in * 1000),
	};
	if (data.refresh_token) update.refreshToken = data.refresh_token;

	try {
		await connectDb();
		await User.updateOne({ _id: user._id }, { $set: update });
	} catch (err) {
		// The new token still works for this request; the next one will simply refresh again.
		console.error(`Failed to persist refreshed Spotify token: ${err?.message ?? err}`);
	}
	return update;
}

// → a usable access token for `user` (refreshing + persisting it when needed), or null.
async function getAccessToken(user, { force = false } = {}) {
	const expiresAt = new Date(user.expiresIn).getTime();
	const stillValid = Boolean(user.accessToken) && Number.isFinite(expiresAt) && expiresAt > Date.now();
	if (!force && stillValid && expiresAt - Date.now() > REFRESH_MARGIN_MS) return user.accessToken;

	const key = String(user._id);
	let pending = inflightRefreshes.get(key);
	if (!pending) {
		pending = refreshAccessToken(user).finally(() => inflightRefreshes.delete(key));
		inflightRefreshes.set(key, pending);
	}
	const update = await pending;
	if (update) {
		Object.assign(user, update); // later calls in this request reuse the fresh token
		return user.accessToken;
	}
	// Refresh failed: keep using the current token while it has not actually expired.
	return !force && stillValid ? user.accessToken : null;
}

// App-only token (client-credentials grant): no user scopes, so it is only used for search (the demo room, and
// real rooms whose owner token is unusable). Cached in-process until shortly before expiry; concurrent callers
// share one token request.
let appToken = null; // { accessToken, expiresAt }
let appTokenRequest = null;

async function getAppAccessToken({ force = false } = {}) {
	if (!force && appToken && appToken.expiresAt - Date.now() > REFRESH_MARGIN_MS) return appToken.accessToken;

	appTokenRequest ??= requestToken({ grant_type: 'client_credentials' }, 'client credentials grant')
		.then((data) => {
			appToken = data ? { accessToken: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 } : null;
			return appToken?.accessToken ?? null;
		})
		.finally(() => {
			appTokenRequest = null;
		});
	return appTokenRequest;
}

/* -------------------------------------------------------------------------- */
/* Requests                                                                    */
/* -------------------------------------------------------------------------- */

function buildUrl(path, params) {
	const url = new URL(API_BASE + path);
	for (const [key, value] of Object.entries(params ?? {})) {
		if (value !== undefined && value !== null) url.searchParams.set(key, String(value));
	}
	return url;
}

// getToken({ force }) → token | null. Retries once with a forced refresh on 401.
// → { data } (parsed JSON, {} for empty 2xx bodies) | { error: 'auth' | 'failed' }
// 'auth' = no usable token, or Spotify rejected it (401 after refresh / 403), so another token might work.
async function sendRequest(getToken, url, { method = 'GET' } = {}) {
	const label = `${method} ${url.pathname}`;
	for (let attempt = 0; attempt < 2; attempt++) {
		const token = await getToken({ force: attempt > 0 });
		if (!token) {
			console.error(
				attempt === 0
					? `Spotify ${label} skipped: no valid access token`
					: `Spotify ${label} failed with status 401 and the token could not be refreshed`,
			);
			return { error: 'auth' };
		}

		let res;
		try {
			res = await fetch(url, {
				method,
				headers: { Authorization: `Bearer ${token}` },
				signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
			});
		} catch (err) {
			console.error(`Spotify ${label} failed: ${err?.name ?? 'Error'}`);
			return { error: 'failed' };
		}

		if (res.status === 401 && attempt === 0) continue;
		if (!res.ok) {
			console.error(`Spotify ${label} failed with status ${res.status}`);
			return { error: res.status === 401 || res.status === 403 ? 'auth' : 'failed' };
		}

		const text = await res.text().catch(() => '');
		if (!text) return { data: {} };
		try {
			return { data: JSON.parse(text) };
		} catch {
			return { data: {} }; // e.g. POST /me/player/queue may answer 200 with a non-JSON body
		}
	}
	return { error: 'auth' };
}

// Request with `user`'s token → parsed JSON or null on any failure.
async function spotifyRequest(user, url, options) {
	const result = await sendRequest((opts) => getAccessToken(user, opts), url, options);
	return result.data ?? null;
}

// Fetches every page of an offset-paginated endpoint (in order, a few pages at a time) → items[] | null.
async function getAllItems(user, path, params, limit) {
	const first = await spotifyRequest(user, buildUrl(path, { ...params, limit, offset: 0 }));
	if (!first || !Array.isArray(first.items)) return null;

	const items = [...first.items];
	const total = Math.min(Number.isFinite(first.total) ? first.total : items.length, MAX_TRACKS);
	const offsets = [];
	for (let offset = limit; offset < total; offset += limit) offsets.push(offset);

	for (let i = 0; i < offsets.length; i += PAGE_CONCURRENCY) {
		const pages = await Promise.all(
			offsets
				.slice(i, i + PAGE_CONCURRENCY)
				.map((offset) => spotifyRequest(user, buildUrl(path, { ...params, limit, offset }))),
		);
		for (const page of pages) {
			if (!page || !Array.isArray(page.items)) return null;
			items.push(...page.items);
		}
	}
	return items;
}

/* -------------------------------------------------------------------------- */
/* Endpoints                                                                   */
/* -------------------------------------------------------------------------- */

// Profile of a freshly authorized user (OAuth callback) → { id, displayName, pictureUrl } | null
export async function getProfile(accessToken) {
	let res;
	try {
		res = await fetch(`${API_BASE}/me`, {
			headers: { Authorization: `Bearer ${accessToken}` },
			signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
		});
	} catch (err) {
		console.error(`Spotify GET /v1/me failed: ${err?.name ?? 'Error'}`);
		return null;
	}
	if (!res.ok) {
		console.error(`Spotify GET /v1/me failed with status ${res.status}`);
		return null;
	}
	const me = await res.json().catch(() => null);
	if (!me || typeof me.id !== 'string' || !me.id) return null;
	return {
		id: me.id,
		displayName: me.display_name || me.id,
		pictureUrl: Array.isArray(me.images) && me.images[0]?.url ? me.images[0].url : '',
	};
}

// → Queue | null
export async function getQueue(user) {
	const data = await spotifyRequest(user, buildUrl('/me/player/queue'));
	return data ? slimQueue(data) : null;
}

// Search with the room owner's token (market-relevant results). If that token is unusable (refresh failed, 401/403),
// falls back to the app token so search keeps working. → Track[] | null
export async function searchTracks(user, query) {
	const url = buildUrl('/search', { q: query, type: 'track' });
	let result = await sendRequest((opts) => getAccessToken(user, opts), url);
	if (result.error === 'auth') {
		console.error('Spotify search: owner token unusable, falling back to the app token');
		result = await sendRequest(getAppAccessToken, url);
	}
	return result.data ? slimTracks(result.data.tracks?.items) : null;
}

// Search with the app (client-credentials) token only, e.g. for the demo room. → Track[] | null
export async function searchTracksAsApp(query) {
	const result = await sendRequest(getAppAccessToken, buildUrl('/search', { q: query, type: 'track' }));
	return result.data ? slimTracks(result.data.tracks?.items) : null;
}

// → true when Spotify accepted the track
export async function addToQueue(user, trackId) {
	const data = await spotifyRequest(user, buildUrl('/me/player/queue', { uri: `spotify:track:${trackId}` }), {
		method: 'POST',
	});
	return data !== null;
}

// The user's own/followed playlists (first 50, like before) → Playlist[] | null
export async function getMyPlaylists(user) {
	const data = await spotifyRequest(user, buildUrl('/me/playlists', { limit: 50 }));
	if (!data) return null;
	return slimPlaylists(data.items);
}

// → string | null
export async function getPlaylistName(user, playlistId) {
	const data = await spotifyRequest(user, buildUrl(`/playlists/${encodeURIComponent(playlistId)}`, { fields: 'name' }));
	return typeof data?.name === 'string' ? data.name : null;
}

// All tracks of a playlist (local/removed items dropped) → Track[] | null
export async function getPlaylistTracks(user, playlistId) {
	const items = await getAllItems(
		user,
		`/playlists/${encodeURIComponent(playlistId)}/tracks`,
		{ fields: PLAYLIST_ITEM_FIELDS },
		100,
	);
	return items ? slimTrackItems(items) : null;
}

// All of the user's Liked Songs → Track[] | null
export async function getSavedTracks(user) {
	const items = await getAllItems(user, '/me/tracks', {}, 50);
	return items ? slimTrackItems(items) : null;
}
