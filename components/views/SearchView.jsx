"use client";

import { useRef, useState } from "react";

import { searchTracks } from "@/lib/actions";
import { useAlert } from "../AlertProvider";
import {
    CONNECTION_ISSUE_MESSAGE,
    CONNECTION_ISSUE_TITLE,
    ERROR_VIEW,
    SEARCH_DEBOUNCE_MS,
} from "../constants";
import RoomHeader from "../RoomHeader";
import { useRoom } from "../RoomProvider";
import SongCard from "../SongCard";

// /<room>/search: search as you type (debounced); tap a result to add it to the queue.
const SearchView = () => {
    const { room, addSong } = useRoom();
    const { showAlert } = useAlert();

    const [searchText, setSearchText] = useState("");
    const [results, setResults] = useState([]);
    const debounce = useRef(null);
    // Id of the latest search; responses for older ids are stale and ignored.
    const latestSearch = useRef(0);

    const handleUpdateText = (event) => {
        const text = event.target.value;
        setSearchText(text);
        clearTimeout(debounce.current);
        const id = ++latestSearch.current;

        if (!text.trim()) {
            setResults([]);
            return;
        }

        debounce.current = setTimeout(async () => {
            try {
                const tracks = await searchTracks(room.url, text);
                if (latestSearch.current === id) setResults(Array.isArray(tracks) ? tracks : []);
            } catch {
                if (latestSearch.current === id) {
                    showAlert(CONNECTION_ISSUE_TITLE, CONNECTION_ISSUE_MESSAGE, ERROR_VIEW);
                }
            }
        }, SEARCH_DEBOUNCE_MS);
    };

    const handleAddSong = (song) => {
        // Clear the search box and results right away (and ignore any search still in flight).
        clearTimeout(debounce.current);
        latestSearch.current++;
        setSearchText("");
        setResults([]);
        addSong(song);
    };

    const searchBar = (
        <div>
            <div className="flex justify-center">
                <div className="m-2 px-4">
                    <div className="relative">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="absolute top-0 bottom-0 left-3 my-auto h-6 w-6 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
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
                            aria-label="Search"
                            className="w-full rounded-md border bg-gray-50 py-3 pl-12 pr-4 text-gray-500 outline-hidden focus:border-indigo-600 focus:bg-white"
                            onChange={handleUpdateText}
                            value={searchText}
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    const searchResults =
        searchText && results.length ? (
            <div className="m-auto max-w-lg flex-col justify-center">
                <div className="mt-4 mb-2 text-3xl">Search Results</div>
                <ul>
                    {results.map((song, i) => (
                        <SongCard key={`search-${song.id}-${i}`} song={song} onClick={handleAddSong} />
                    ))}
                </ul>
            </div>
        ) : null;

    return (
        <div className="my-12">
            <RoomHeader />
            {searchBar}
            {searchResults}
        </div>
    );
};

export default SearchView;
