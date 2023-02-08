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
		console.log(err)
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
		console.log(err)
		return null;
    }
}

const addToQueue = async (user, id) => {
	await updateAccessToken(user);
    try {
		const api = buildRequest(user);
		const response = await api.post("/me/player/queue?"+ qs.stringify({
			uri: `spotify:track:${id}`,
		}))
		return response.data;
    } catch (err) {
		console.log(err)
		return false;
    }
}

module.exports = {
    getQueue,
    search,
    addToQueue,
}
