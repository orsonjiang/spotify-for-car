"use client";

import AlbumCover from "./AlbumCover";
import { useRoom } from "./RoomProvider";

// A track row. With `onClick` the whole card is a button (tap to add); the most recently added song gets a blue
// border (old SongCard.jsx).
const SongCard = ({ song, onClick }) => {
    const { addedSong } = useRoom();

    let className = "flex bg-zinc-200 dark:bg-zinc-900 rounded-xl m-2 overflow-clip";
    if (song.id === addedSong) {
        className += " border border-blue-600";
    }

    const content = (
        <>
            <AlbumCover album={song.album} />
            <div className="mt-2 mr-2 flex flex-col overflow-clip text-left">
                <p className="truncate text-base font-normal">{song.name}</p>
                <p className="text-sm font-light">
                    {(song.album?.artists ?? []).map((artist) => artist.name).join(", ")}
                </p>
            </div>
        </>
    );

    if (!onClick) {
        return <li className={className}>{content}</li>;
    }

    return (
        <li className={className}>
            <button type="button" className="flex w-full text-left" onClick={() => onClick(song)}>
                {content}
            </button>
        </li>
    );
};

export default SongCard;
