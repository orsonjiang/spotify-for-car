import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import store from "../../../store";
import api from "../../../api/api";
import { useState } from "react";

const SongSearch = () => {
    const { roomId } = useParams();
    const [text, setText] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    const handleUpdateText = (event) => {
        setText(event.target.value);
    };

    const handleKeyDown = (event) => {
        if (event.code === "Enter") {
            handleSearch();
        }
    };

    const handleSearch = async () => {
        let search = await api.search(roomId, text);
        setSearchResults(search.data.tracks.items);
    };
    
    console.log(searchResults)

    return (
        <div>
            <div className="mt-16 mb-2 text-4xl">Song Search</div>
            <div className="m-2">
                <input
                    type="text"
                    id="ssearch"
                    onChange={handleUpdateText}
                    onKeyDown={handleKeyDown}
                    value={text}
                ></input>
                <button onClick={handleSearch}>Search</button>
            </div>
        </div>
    );
};

export default SongSearch;
