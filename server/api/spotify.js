const axios = require('axios');
const qs = require('qs');

const refreshAccessToken = async (user) => {
    try {
		let date = new Date();

        const response = await axios({
			method: 'post',
			url: 'https://accounts.spotify.com/api/token',
			headers: {
				'Authorization': `Basic ${Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64')}`,
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			data: qs.stringify({
				'grant_type': 'refresh_token',
				'refresh_token': user.refreshToken,
			})
		});

		date.setSeconds(date.getSeconds() + response.data.expires_in)
		user.accessToken = response.data.access_token;
		user.expiresIn = date;
		await user.save();
    } catch (err) {
        console.log(err)
    }
}

const updateAccessToken = async (user) => {
	const date = new Date();
	date.setSeconds(date.getSeconds() + 10);
	if (date > user.expiresIn) {
		await refreshAccessToken(user);
	}
}

const buildRequest = (user) => {
	const instance = axios.create({
		baseURL: "https://api.spotify.com/v1/",
		headers: {
			'Authorization': `Bearer ${user.accessToken}`,
		},
	})
	return instance;
}

const getQueue = async (user) => {
	await updateAccessToken(user);
    try {
		const api = buildRequest(user);
		const response = await api.get("/me/player/queue")
		return response.data;
    } catch (err) {
		// console.log(err)
		return null;
    }
}

const search = async (user, q) => {
	await updateAccessToken(user);
    try {
		const api = buildRequest(user);
		const response = await api.get("/search?" + qs.stringify({
			q: q,
			type: "track"
		}))
		return response.data;
    } catch (err) {
		// console.log(err)
		return null;
    }
}

const addToQueue = async (user, id) => {
	await updateAccessToken(user);
    try {
		const api = buildRequest(user);
		await api.post("/me/player/queue?"+ qs.stringify({
			uri: `spotify:track:${id}`,
		}))
		return true;
    } catch (err) {
		// console.log(err)
		return false;
    }
}

const getLibrary = async (user) => {
	await updateAccessToken(user);
    try {
		const api = buildRequest(user);
		const res = await api.get(`/users/${user.spotifyId}/playlists?` + qs.stringify({
			limit: 50
		}));
		return res.data;
    } catch (err) {
		// console.log(err)
		return null;
    }
}

const getPlaylist = async (user, playlistId) => {
	await updateAccessToken(user);
    try {
		const api = buildRequest(user);
		let res = await api.get(`/playlists/${playlistId}/tracks?` + qs.stringify({
			limit: 50
		}));

		let songs = res.data.items;

		while (res.data.next !== null) {
			res = await api.get(res.data.next);
			songs = songs.concat(res.data.items);
		}

		return songs;
    } catch (err) {
		// console.log(err)
		return null;
    }
}

module.exports = {
    getQueue,
    search,
    addToQueue,
	getLibrary,
	getPlaylist,
}
