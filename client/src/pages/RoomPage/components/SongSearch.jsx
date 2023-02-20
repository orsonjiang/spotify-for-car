import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { setSearchText, setSearchResults, setAddedSong, setQueue } from "../../../actions";

import store from "../../../store";
import api from "../../../api/api";
import SongCard from "./SongCard";

const SongSearch = () => {
    const { roomId } = useParams();

    const { text, results } = useSelector((state) => state.search);

    const handleUpdateText = (event) => {
        store.dispatch(setSearchText(event.target.value));
    };

    const handleKeyDown = (event) => {
        if (event.code === "Enter") {
            handleSearch();
        }
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
            store.dispatch(setQueue(queue.data))
        }
    };

    let CurrentView = results.length ? (
        results.map((song) => {
            return (
                <SongCard key={"search-" + song.id} song={song} onClick={handleAddSong} />
            );
        })
    ) : (
        <div className="m-2">
            <input
                type="text"
                id="ssearch"
                onChange={handleUpdateText}
                onKeyDown={handleKeyDown}
                value={text}
                className="bg-neutral-100 dark:bg-neutral-700"
            ></input>
            <button onClick={handleSearch}>Search</button>
        </div>
    );

    return (
        <div>
            <div className="mt-16 mb-2 text-4xl">Song Search</div>
            {CurrentView}
        </div>
    );
};

export default SongSearch;
