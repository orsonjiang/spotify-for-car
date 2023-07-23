import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useState } from 'react';

import { SUCCESS_VIEW } from '../../../../constants/alertTypes';
import { runAlert } from "../../../../helpers/alert";
import {
    setSearchResults,
    setAddedSong,
    setQueue,
} from '../../../../actions';
import store from '../../../../store';
import api from '../../../../api/api';

import Navbar from '../../components/Navbar';
import SongCard from '../../components/SongCard';

const SearchView = () => {
    const actualRoomId = useParams()['*']
    const roomId = actualRoomId === "demo" ? import.meta.env.VITE_DEMO_API : actualRoomId;

    const { results } = useSelector((state) => state.search);

    const [searchText, setSearchText] = useState("");

    const handleUpdateText = (event) => {
        event.preventDefault();
        const text = event.target.value;
        if (text) {
            handleSearch(text);
        }
        setSearchText(event.target.value);
    };

    const handleSearch = async (text) => {
        let search = await api.search(roomId, text);
        store.dispatch(setSearchResults(search.data.tracks.items));
    };

    const handleAddSong = async (trackId, trackName) => {
        if (actualRoomId === "demo") {
            return;
        }
        setSearchText("");
        let addSong = await api.addToQueue(roomId, trackId);
        if (addSong.status == 200) {
            runAlert("Song Added", `${trackName} has been added to the queue!`, SUCCESS_VIEW);
            store.dispatch(setAddedSong(trackId));
            let queue = await api.getQueue(roomId);
            store.dispatch(setQueue(queue.data));
        }
    };

    const SearchBar = (
        <div>
            <div className="flex justify-center">
                <div
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
                            onChange={handleUpdateText}
                            value={searchText}
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    const CurrentView = searchText && results.length ? (
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
        ''
    );

    return (
        <div className="my-12">
            <Navbar />
            {SearchBar}
            {CurrentView}
        </div>
    );
};

export default SearchView;
