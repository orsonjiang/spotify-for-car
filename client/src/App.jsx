import { useState, useEffect } from "react";
import api from "./api";

function App() {
    const [store, setStore] = useState({
        songAdded: "",
        currentSong: undefined,
        queue: [],
        songs: [],
        searchText: "",
        lastAdded: "",
    });

    useEffect(() => {
        handleGetQueue();
    }, []);

    const handleGetQueue = () => {
        async function asyncfunction() {
            let response = await api.getCurrentQueue();
            setStore({
                ...store,
                currentSong: response.data.currently_playing,
                queue: response.data.queue,
            });
        }
        asyncfunction();
    };

    const handleSearch = () => {
        async function asyncfunction() {
            let response = await api.searchSongs(store.searchText);
            setStore({
                ...store,
                searchText: "",
                songs: response.data.tracks.items,
            });
        }
        asyncfunction();
    };

    const handleKeyDown = (event) => {
        if (event.code === "Enter") {
            handleSearch();
        }
    };

    const handleUpdateText = (event) => {
        setStore({
            ...store,
            searchText: event.target.value,
        });
    };

    const handleAddSong = (event) => {
        const id = event.target.id;
        async function asyncfunction() {
            try {
                let response = await api.addSongToQueue(id);
                if (response.status == 204) {
                    response = await api.getCurrentQueue();
                    let songAdded = response.data.queue.filter(
                        (track) => track.id == id
                    )[0];

                    setStore({
                        ...store,
                        songs: [],
                        currentSong: response.data.currently_playing,
                        queue: response.data.queue,
                        lastAdded: id,
                        songAdded: `${songAdded.name} by ${songAdded.album.artists[0].name}`,
                    });
                }
            } catch {
                setStore({
                    ...store,
                    songs: [],
                });
            }
        }
        asyncfunction();
    };

    let songs = "";
    if (store.songs.length) {
        songs = (
            <ul>
                {store.songs.map((track) => (
                    <li
                        key={track.id}
                        id={track.id}
                        className={"song-card"}
                        onClick={handleAddSong}
                    >
                        {track.name} by {track.album.artists[0].name}
                    </li>
                ))}
            </ul>
        );
    }

    let queue = "";
    if (store.currentSong) {
        if (store.currentSong.id == store.queue[0].id) {
            store.queue.shift();
        }
        let currentSongClassName =
            store.lastAdded == store.currentSong.id
                ? "queue-card highlighted"
                : "queue-card";
        queue = (
            <div>
                <h3 className="text-3xl mb-2">Current Song</h3>
                <ul>
                    <li
                        key={store.currentSong.id}
                        className={currentSongClassName}
                    >
                        {store.currentSong.name} by{" "}
                        {store.currentSong.album.artists[0].name}
                    </li>
                </ul>
                <h3 className="text-3xl mt-4 mb-2">Current Queue</h3>
                <ul>
                    {store.queue.map((track) => {
                        return track.id == store.lastAdded ? (
                            <li
                                key={track.id}
                                className={"queue-card highlighted"}
                            >
                                {track.name} by {track.album.artists[0].name}
                            </li>
                        ) : (
                            <li key={track.id} className={"queue-card"}>
                                {track.name} by {track.album.artists[0].name}
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    } else {
        queue = <h4>No song playing.</h4>;
    }

    let songAddedText = store.songAdded ? (
        <p>{`${store.songAdded} has been added to the queue.`}</p>
    ) : (
        ""
    );

    return (
        <div className="App">
            <h1 className="text-5xl m-16">Spotify for Car</h1>
            <h2 className="text-4xl mb-2">Song Search</h2>
            <div className="m-2">
                <input
                    type="text"
                    id="ssearch"
                    onChange={handleUpdateText}
                    onKeyDown={handleKeyDown}
                    value={store.searchText}
                ></input>
                <button onClick={handleSearch}>Search</button>
            </div>
            {songAddedText}
            {songs}

            <h2 className="text-4xl mt-16 mb-2">Song View</h2>
            <button className="mb-4"onClick={handleGetQueue}>Reload Songs</button>
            {queue}
        </div>
    );
}

export default App;
