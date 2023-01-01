const User = require("../models/user-model");
const axios = require('axios');
const qs = require('qs');

const login = (req, res) => {
    let scope = ['user-read-playback-state', 'user-modify-playback-state', 'user-read-private', 'user-read-email'].join(" ");
    let query = qs.stringify({
        response_type: 'code',
        client_id: 'bcda302975934602abe93b7c80a76c79',
        scope: scope,
        redirect_uri: process.env.CALLBACK_URI,
    });

    res.redirect('https://accounts.spotify.com/authorize?' + query);
}
const callback = async (req, res) => {
	console.log(req)
    let config = {
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'Authorization': `Basic ${Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: qs.stringify({
			'grant_type': 'authorization_code',
			'code': req.query.code,
			'redirect_uri': process.env.CALLBACK_URI,
		})
    };

    try {
        let response = await axios(config);
        return res.status(200).json(response.data);
    } catch (err) {
        return res.status(400).json(err);
    }
}

module.exports = {
	login,
	callback,
}