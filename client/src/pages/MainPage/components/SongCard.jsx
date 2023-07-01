import { useSelector } from 'react-redux';

import AlbumCover from '../../components/AlbumCover';

const SongCard = (props) => {
    const { song, onClick } = props;
    const addedSong = useSelector((state) => state.search.addedSong);

    let className = 'flex bg-zinc-200 dark:bg-zinc-900 rounded-xl m-2 overflow-clip';
    if (song.id == addedSong) {
        className += ' border border-blue-600';
    }

    return (
        <li
            key={song.id}
            className={className}
            onClick={onClick ? () => onClick(song.id, song.name) : undefined}
        >
			<AlbumCover album={song.album}/>
            <div className="mt-2 flex flex-col text-left mr-2 overflow-clip">
                <p className="text-base font-normal truncate">{song.name}</p>
                <p className="text-sm font-light">
                    {song.album.artists.map((artist) => artist.name).join(', ')}
                </p>
            </div>
        </li>
    );
};

export default SongCard;
