import { roomPath } from "@/components/constants";
import LibraryLogin from "@/components/LibraryLogin";
import PlaylistCard from "@/components/PlaylistCard";
import { getViewerPlaylists } from "@/lib/data";

// /<room>/library: the viewer's own playlists (Liked Songs first). Streams behind ./loading.jsx.
export default async function LibraryPage({ params }) {
    const { room } = await params;
    const playlists = await getViewerPlaylists(room);

    if (!playlists) {
        return <LibraryLogin />;
    }

    if (!playlists.length) {
        return (
            <div>
                <div className="m-8 text-3xl">My Library</div>
            </div>
        );
    }

    return (
        <div>
            <div className="m-auto max-w-lg flex-col justify-center">
                <div>
                    <div className="m-8 text-3xl">My Library</div>
                    <ul>
                        {playlists.map((playlist, i) => (
                            <PlaylistCard
                                key={`playlist-${playlist.id}-${i}`}
                                playlist={playlist}
                                href={roomPath(room, "library", playlist.id)}
                            />
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
