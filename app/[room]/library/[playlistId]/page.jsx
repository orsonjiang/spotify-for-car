import PlaylistView from "@/components/views/PlaylistView";
import { getViewerPlaylist } from "@/lib/data";

// /<room>/library/<playlistId>: big playlists are slow to page through, so this streams behind ./loading.jsx.
export default async function PlaylistPage({ params }) {
    const { room, playlistId } = await params;
    const playlist = await getViewerPlaylist(room, playlistId);

    return <PlaylistView playlist={playlist} />;
}
