// Converts raw Spotify objects (real API responses and the demo fixtures alike) into the small, plain shapes
// that cross the server → client boundary (see SPEC "Data shapes"). Raw objects are huge (available_markets…)
// and must never be returned as-is.
import 'server-only';

export const LIKED_SONGS_ID = 'liked';
export const LIKED_SONGS_NAME = 'Liked Songs';

// The pseudo-playlist that always heads the library (fresh object per call).
export function likedSongsPlaylist() {
	return { id: LIKED_SONGS_ID, name: LIKED_SONGS_NAME, ownerName: 'You', images: [{ url: '/images/liked-songs.png' }] };
}

// Cover art is rendered as a 48px thumbnail. Spotify lists images largest-first (640, 300, 64), so keep one image:
// the smallest that is still sharp on high-DPI screens, or the first one when sizes are unknown.
const MIN_IMAGE_WIDTH = 120;

export function slimImages(images) {
	if (!Array.isArray(images)) return [];
	const valid = images.filter((image) => image && typeof image.url === 'string' && image.url);
	if (!valid.length) return [];
	const bigEnough = valid.filter((image) => typeof image.width === 'number' && image.width >= MIN_IMAGE_WIDTH);
	const best = bigEnough.length
		? bigEnough.reduce((a, b) => (b.width < a.width ? b : a))
		: valid[0];
	return [{ url: best.url }];
}

function slimArtists(artists) {
	if (!Array.isArray(artists)) return [];
	return artists.filter((artist) => artist && artist.name).map((artist) => ({ name: String(artist.name) }));
}

// → Track | null (null for local/removed/unplayable items without an id).
export function slimTrack(track) {
	if (!track || typeof track !== 'object' || typeof track.id !== 'string' || !track.id) return null;

	let album = track.album;
	if (!album && track.show) {
		// Podcast episodes (e.g. the currently playing item) have a show instead of an album.
		album = { name: track.show.name, images: track.images ?? track.show.images, artists: [{ name: track.show.publisher }] };
	}

	return {
		id: track.id,
		name: typeof track.name === 'string' ? track.name : '',
		uri: typeof track.uri === 'string' ? track.uri : `spotify:track:${track.id}`,
		artists: slimArtists(track.artists),
		album: {
			name: typeof album?.name === 'string' ? album.name : '',
			images: slimImages(album?.images),
			artists: slimArtists(album?.artists),
		},
	};
}

export function slimTracks(tracks) {
	if (!Array.isArray(tracks)) return [];
	return tracks.map(slimTrack).filter(Boolean);
}

// Playlist/saved-track items are `{ track, added_at, ... }` wrappers.
export function slimTrackItems(items) {
	if (!Array.isArray(items)) return [];
	return items.map((item) => slimTrack(item?.track)).filter(Boolean);
}

// `currentSong`/`currently_playing` naming: the demo fixture already uses the slim names, the API does not.
export function slimQueue(raw) {
	if (!raw || typeof raw !== 'object') return { currentSong: null, queue: [] };
	return {
		currentSong: slimTrack(raw.currently_playing ?? raw.currentSong ?? null),
		queue: slimTracks(raw.queue),
	};
}

// → Playlist | null
export function slimPlaylist(playlist) {
	if (!playlist || typeof playlist !== 'object' || typeof playlist.id !== 'string' || !playlist.id) return null;
	return {
		id: playlist.id,
		name: typeof playlist.name === 'string' ? playlist.name : '',
		ownerName: String(playlist.owner?.display_name ?? playlist.owner?.id ?? ''),
		images: slimImages(playlist.images),
	};
}

export function slimPlaylists(playlists) {
	if (!Array.isArray(playlists)) return [];
	return playlists.map(slimPlaylist).filter(Boolean);
}
