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

const getQueue = async (user) => {
	await updateAccessToken(user);
    try {
		const response = await axios({
			method: 'get',
			url: 'https://api.spotify.com/v1/me/player/queue',
			headers: {
				'Authorization': `Bearer ${user.accessToken}`,
			},
		});
		return response.data;
    } catch (err) {
		console.log(err)
		return null;
    }
}

const search = async (user, q) => {
	await updateAccessToken(user);
    try {
		const response = await axios({
			method: 'get',
			url: 'https://api.spotify.com/v1/search?' + qs.stringify({
				q: q,
				type: "track"
			}),
			headers: {
				'Authorization': `Bearer ${user.accessToken}`,
			},
		});
		return response.data;
    } catch (err) {
		console.log(err)
		return null;
    }
}

const addToQueue = async (user, id) => {
	await updateAccessToken(user);
    try {
		await axios({
			method: 'post',
			url: 'https://api.spotify.com/v1/me/player/queue?' + qs.stringify({
				uri: `spotify:track:${id}`,
			}),
			headers: {
				'Authorization': `Bearer ${user.accessToken}`,
			},
		});
		return true;
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
