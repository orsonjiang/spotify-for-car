import axios from 'axios';
import queryString from 'query-string';

const api = axios.create({
    baseURL: 'https://api.spotify.com/v1',
    headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TOKEN}`
    }
})

export const getCurrentQueue = () => {
    return api.get("/me/player/queue");
}

export const searchSongs = (text) => {
    return api.get("/search?" + queryString.stringify({
        q: text,
        type: "track",
    }));
}

export const addSongToQueue = (id) => {
    return api.post("/me/player/queue?" + queryString.stringify({
        uri: `spotify:track:${id}`
    }));
}

const apis = {
    getCurrentQueue,
    searchSongs,
    addSongToQueue,
}

export default apis;