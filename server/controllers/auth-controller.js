const axios = require('axios');
const qs = require('qs');
const User = require("../models/user-model");
const auth = require("../auth");
const api = require("../api/spotify");
const crypto = require("crypto");

require('dotenv').config();

const login = (req, res) => {
    const state = crypto.randomBytes(16).toString('hex');
    res.cookie(state, JSON.stringify({
        location: req.query.location
    }));

    const scope = ['user-read-playback-state', 'user-modify-playback-state', 'user-read-private', 'playlist-read-private', 'playlist-read-collaborative', 'user-library-read'].join(" ");
    const query = qs.stringify({
        response_type: 'code',
        client_id: process.env.CLIENT_ID,
        scope: scope,
        redirect_uri: process.env.SERVER_URL + "/auth/callback",
        state: state,
    });

    res.redirect('https://accounts.spotify.com/authorize?' + query);
}

const callback = async (req, res) => {
    if (!req.query.code || !req.query.state) {
        res.redirect(`${process.env.CLIENT_URL}/error`);
    }

    const stateCookie = req.cookies ? req.cookies[req.query.state] : null;

    if (stateCookie === null) {
        res.redirect(`${process.env.CLIENT_URL}/error?msg=statemm`);
    }

    res.clearCookie(req.query.state);
    const stateObject = JSON.parse(stateCookie);

    const date = new Date();

    try {
        const credReq = await axios({
            method: 'post',
            url: 'https://accounts.spotify.com/api/token',
            headers: {
                'Authorization': `Basic ${Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64')}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: qs.stringify({
                'grant_type': 'authorization_code',
                'code': req.query.code,
                'redirect_uri': process.env.SERVER_URL + "/auth/callback",
            })
        });

        date.setSeconds(date.getSeconds() + credReq.data.expires_in)

        const profileReq = await axios({
            method: 'get',
            url: 'https://api.spotify.com/v1/me',
            headers: {
                'Authorization': `Bearer ${credReq.data.access_token}`,
            },
        });

        let _id = '';
        let url = '';

        const existingUser = await User.findOne({ spotifyId: profileReq.data.id });
        if (existingUser) {
            _id = existingUser._id;
            url = existingUser.url;
        } else {
            const picture_url = profileReq.data.images.length ? profileReq.data.images[0].url : "";

            const newUser = new User({
                displayName: profileReq.data.display_name,
                spotifyId: profileReq.data.id,
                accessToken: credReq.data.access_token,
                refreshToken: credReq.data.refresh_token,
                expiresIn: date,
                url: profileReq.data.id,
                picture_url: picture_url,
            });
            const savedUser = await newUser.save();
            _id = savedUser._id;
            url = profileReq.data.id;
        }

        res.cookie("token", auth.signToken(_id), {
            httpOnly: true,
            secure: true,
            sameSite: true,
        })
        if (stateObject.location === '/') {
            res.redirect(`${process.env.CLIENT_URL}/${url}`);
        } else {
            res.redirect(`${process.env.CLIENT_URL}${stateObject.location}`);
        }

    } catch (err) {
        res.redirect(`${process.env.CLIENT_URL}/error`);
        console.log(err)
    }
}

const logout = async (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        secure: true,
        sameSite: false,
        expires: new Date(0),
    }).send();
};

const profile = async (req, res) => {
    res.set("Access-Control-Allow-Origin", process.env.CLIENT_URL);

	if (!req.userId) {
		res.status(400).json({
			user: null,
			errorMessage: "Unauthorized",
		});
        res.end()
	}

	User.findOne({ _id: req.userId }, async (err, user) => {
		if (err || !user) {
			res.status(400).json({
				user: null,
				errorMessage: "Unauthorized",
			});
            res.end()
		}

		res.status(200).json({
			user: {
				displayName: user.displayName,
				url: user.url,
                picture_url: user.picture_url,
                id: user.spotifyId
			},
		});
		res.end();
	})
}

const getLibrary = async (req, res) => {
	res.set("Access-Control-Allow-Origin", process.env.CLIENT_URL);
	if (!req.userId) {
		return res.status(400).json({
			user: null,
			errorMessage: "Unauthorized",
		});
	}

	User.findOne({ _id: req.userId }, async (err, user) => {
		if (err || !user) {
			return res.status(400).json({
				user: null,
				errorMessage: "Unauthorized",
			});
		}

		const response = await api.getLibrary(user);

		res.status(200).json(response);

		res.end();
	})
}

const getPlaylist = async (req, res) => {
	res.set("Access-Control-Allow-Origin", process.env.CLIENT_URL);
	if (!req.userId) {
		return res.status(400).json({
			user: null,
			errorMessage: "Unauthorized",
		});
	}

	User.findOne({ _id: req.userId }, async (err, user) => {
		if (err || !user) {
			return res.status(400).json({
				user: null,
				errorMessage: "Unauthorized",
			});
		}

		const response = req.params.id === "liked" ? await api.getLikedSongs(user) : await api.getPlaylist(user, req.params.id);

		res.status(200).json(response);

		res.end();
	})
}

module.exports = {
    login,
    callback,
    logout,
    profile,
    getLibrary,
	getPlaylist,
}