import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
    setSearchText,
    setSearchResults,
    setAddedSong,
    setQueue,
} from '../../../../actions';

import DEFAULT_PROFILE from '../../../../assets/default_profile.jpeg';
import store from '../../../../store';
import api from '../../../../api/api';
import SongCard from '../QueueView/components/SongCard';
import { fetchQueue } from '../../../../helpers';

const SearchView = () => {
    const roomId = useParams()['*'];

    const roomDetails = useSelector((state) => state.room)
    const { text, results } = useSelector((state) => state.search);

    const handleUpdateText = (event) => {
        store.dispatch(setSearchText(event.target.value));
    };

    const handleOnSubmit = (event) => {
        event.preventDefault();
        handleSearch();
    };

    const handleSearch = async () => {
        let search = await api.search(roomId, text);
        store.dispatch(setSearchResults(search.data.tracks.items));
    };

    const handleAddSong = async (trackId) => {
        let addSong = await api.addToQueue(roomId, trackId);
        if (addSong.status == 200) {
            store.dispatch(setAddedSong(trackId));
            let queue = await api.getQueue(roomId);
            store.dispatch(setQueue(queue.data));
        }
    };

    let CurrentView = results.length ? (
        <div className="m-auto max-w-lg flex-col justify-center">
            <div className="mt-4 mb-2 text-3xl">Search Results</div>
            {results.map((song) => {
                return (
                    <SongCard
                        key={'search-' + song.id}
                        song={song}
                        onClick={handleAddSong}
                    />
                );
            })}
        </div>
    ) : (
        <div>
            <div className="flex justify-center">
                <form
                    onSubmit={handleOnSubmit}
                    onChange={handleUpdateText}
                    value={text}
                    className="m-2 px-4"
                >
                    <div className="relative">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="absolute top-0 bottom-0 left-3 my-auto h-6 w-6 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search"
                            className="w-full rounded-md border bg-gray-50 py-3 pl-12 pr-4 text-gray-500 outline-none focus:border-indigo-600 focus:bg-white"
                        />
                    </div>
                </form>
            </div>
        </div>
    );

    return (
        <div className='my-12'>
            <div className="m-4 flex content-center justify-center gap-12 align-middle">
                <div className="mx-2 flex items-center gap-x-3">
                    <img
                        src={roomDetails.picture_url || DEFAULT_PROFILE}
                        className="h-16 w-16 rounded-full"
                    />
                    <div>
                        <span className="block text-xl">{roomDetails.displayName || "Someone"}'s Room</span>
                    </div>
                </div>

                <div className="my-auto">
                    <button
                        className="gap-2 rounded-lg bg-green-600 px-5 py-3 duration-150 hover:bg-green-500 active:bg-green-700"
                        onClick={fetchQueue}
                    >
                        Reload Songs
                    </button>
                </div>
            </div>
            {CurrentView}
        </div>
    );
};

export default SearchView;
