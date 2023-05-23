import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import {
    setAddedSong,
    setQueue,
    setLibrary,
    setPlaylist,
} from '../../../../actions';
import store from '../../../../store';
import api from '../../../../api/api';
import PlaylistCard from './components/PlaylistCard';
import SongCard from '../../components/SongCard';
import LoginButton from '../../components/LoginButton';

const LibraryView = () => {
    const roomId = useParams()['*'];
    const { user } = useSelector((state) => state.user);
    const { library, playlist } = useSelector((state) => state.library);

    const handleSetPlaylist = async (id) => {
        const res = await api.getPlaylist(id);
        store.dispatch(setPlaylist({
            name: library.filter((playlist) => playlist.id == id)[0].name,
            songs: res.data.items,
        }));
    };

    const handleClearPlaylist = () => {
        store.dispatch(setPlaylist([]));
    };

    const handleAddSong = async (trackId) => {
        let addSong = await api.addToQueue(roomId, trackId);
        if (addSong.status == 200) {
            store.dispatch(setAddedSong(trackId));
            let queue = await api.getQueue(roomId);
            store.dispatch(setQueue(queue.data));
        }
    };

    let i = 0;
    let content = '';
    if (user.displayName === '') {
        content = (
            <div className="mx-16">
                <div className="m-8 text-3xl">My Library</div>
                <div className="text-lg">
                    Login to access your playlists.
                    <br />
                    <br />
                    You will have to rejoin this room after you login.
                </div>
                <div className="my-8">
                    <LoginButton />
                </div>
            </div>
        );
    } else if (playlist.name) {
        content = (
            <div className="flex-col">
                <div>
                    <div className="flex align-middle">
                        <div className="absolute top-7 bottom-0 left-4">
                            <button
                                type="button"
                                className="inline-flex items-center rounded-full border border-green-700 p-2.5 text-center text-sm font-medium text-green-700 hover:bg-green-700 hover:text-white focus:outline-none focus:ring-4 focus:ring-green-300 dark:border-green-500 dark:text-green-500 dark:hover:bg-green-500 dark:hover:text-white dark:focus:ring-green-800"
                                onClick={handleClearPlaylist}
                            >
                                <svg
                                    className="h-5 w-5"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={3}
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                                    />
                                </svg>
                                <span className="sr-only">
                                    Icon description
                                </span>
                            </button>
                        </div>
                        <div className="my-8 mx-auto self-center text-3xl">
                            {playlist.name}
                        </div>
                    </div>
                    <div className="m-auto max-w-lg">
                        <ul>
                            {playlist.songs.map((song) => {
                                return (
                                    <SongCard
                                        key={'queue-' + song.track.id + '-' + i++}
                                        song={song.track}
                                        onClick={handleAddSong}
                                    />
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        );
    } else if (library.length) {
        content = (
            <div className="m-auto max-w-lg flex-col justify-center">
                <div>
                    <div className="m-8 text-3xl">My Library</div>
                    <ul>
                        {library.map((playlist) => {
                            return (
                                <PlaylistCard
                                    id={playlist.id}
                                    key={'playlist-' + playlist.id + '-' + i++}
                                    playlist={playlist}
                                    onClick={handleSetPlaylist}
                                />
                            );
                        })}
                    </ul>
                </div>
            </div>
        );
    } else {
        content = <div className="m-8 text-3xl">My Library</div>;
    }

    return <div>{content}</div>;
};

export default LibraryView;
