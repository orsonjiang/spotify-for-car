import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { setSearchText, setSearchResults } from "../../../actions";

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

    let CurrentView = (
        <div className="m-2">
            <input
                type="text"
                id="ssearch"
                onChange={handleUpdateText}
                onKeyDown={handleKeyDown}
                value={text}
                className="bg-inherit"
            ></input>
            <button onClick={handleSearch}>Search</button>
        </div>
    );
    if (results.length) {
        CurrentView = results.map((song) => {
            return <SongCard key={song.id} song={song} />
        })
    }

    return (
        <div>
            <div className="mt-16 mb-2 text-4xl">Song Search</div>
            {CurrentView}
        </div>
    );
};

export default SongSearch;
