import Link from "next/link";

import AlbumCover from "./AlbumCover";

// A library entry; links to /<room>/library/<playlistId>.
const PlaylistCard = ({ playlist, href }) => {
    return (
        <li className="m-2 flex rounded-xl bg-zinc-200 dark:bg-zinc-900">
            <Link href={href} className="flex w-full">
                <AlbumCover album={playlist} />
                <div className="mt-2 flex flex-col text-left">
                    <p className="text-base font-normal">{playlist.name}</p>
                    <p className="text-sm font-light">{playlist.ownerName}</p>
                </div>
            </Link>
        </li>
    );
};

export default PlaylistCard;
