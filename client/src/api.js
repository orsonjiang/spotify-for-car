import axios from 'axios';
import qs from 'qs';

let api = axios.create({
    baseURL: 'https://api.spotify.com/v1',
    headers: {
        Authorization: `Bearer `
    }
})

const refresh_token = async () => {
    const config = {
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'Authorization': 'Basic YmNkYTMwMjk3NTkzNDYwMmFiZTkzYjdjODBhNzZjNzk6ZjQxYjExYjVlOTAwNDU5OThhMGFjYjc5NGYyNDAxYjc=',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: qs.stringify({
            'grant_type': 'refresh_token',
            'refresh_token': user.refreshToken,
        })
    };

    try {
        let response = await axios(config);
        api = axios.create({
            baseURL: 'https://api.spotify.com/v1',
            headers: {
                Authorization: `Bearer ${response.data.access_token}`
            }
        })
    } catch (err) {
        console.log(err)
    }
}

export const getCurrentQueue = async () => {
    try {
        return await api.get("/me/player/queue");
    } catch {
        await refresh_token();
        return await api.get("/me/player/queue");
    }
}

export const searchSongs = (text) => {
    return api.get("/search?" + qs.stringify({
        q: text,
        type: "track",
    }));
}

export const addSongToQueue = (id) => {
    return api.post("/me/player/queue?" + qs.stringify({
        uri: `spotify:track:${id}`
    }));
}

const apis = {
    getCurrentQueue,
    searchSongs,
    addSongToQueue,
}

export default apis;