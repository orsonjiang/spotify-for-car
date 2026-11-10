"use client";

import LibraryLogin from "../LibraryLogin";
import { useRoom } from "../RoomProvider";
import SongCard from "../SongCard";

// /<room>/library/<playlistId>: the playlist's tracks; tap one to add it to the queue.
// `playlist` is a PlaylistDetail from lib/data.js, or null (not logged in, or the playlist could not be loaded).
const PlaylistView = ({ playlist }) => {
    const { viewer, addSong } = useRoom();

    if (!playlist) {
        if (!viewer) return <LibraryLogin />;
        return (
            <div>
                <div className="m-8 text-3xl">My Library</div>
                <div className="text-lg">This playlist could not be loaded.</div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex-col">
                <div>
                    <div className="mx-auto my-8 self-center text-3xl">{playlist.name}</div>
                    <div className="m-auto max-w-lg">
                        <ul>
                            {playlist.tracks.map((song, i) => (
                                <SongCard key={`playlist-${song.id}-${i}`} song={song} onClick={addSong} />
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlaylistView;
