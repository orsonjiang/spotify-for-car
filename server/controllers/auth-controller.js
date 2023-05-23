const axios = require('axios');
const qs = require('qs');
const User = require("../models/user-model");
const auth = require("../auth");

require('dotenv').config();

const login = (req, res) => {
    const scope = ['user-read-playback-state', 'user-modify-playback-state', 'user-read-private', 'playlist-read-private', 'playlist-read-collaborative', 'user-library-read'].join(" ");
    const query = qs.stringify({
        response_type: 'code',
        client_id: process.env.CLIENT_ID,
        scope: scope,
        redirect_uri: process.env.SERVER_URL + "/auth/login/callback",
    });

    res.redirect('https://accounts.spotify.com/authorize?' + query);
}

const loginCallback = async (req, res) => {
    try {
        let date = new Date();

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
                'redirect_uri': process.env.SERVER_URL + "/auth/login/callback",
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
        res.redirect(`${process.env.CLIENT_URL}/${url}`);

    } catch (err) {
        res.redirect(`${process.env.CLIENT_URL}/error`);
        // return res.status(400).json({
        //     errorMessage: "Unable to verify account with Spotify. Most likely you are not whitelisted.",
        //     err: err
        // });
        // console.log(err)
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
	if (!req.userId) {
		res.status(400).json({
			user: null,
			errorMessage: "Unauthorized",
		});
	}

	User.findOne({ _id: req.userId }, async (err, user) => {
		if (err || !user) {
			res.status(400).json({
				user: null,
				errorMessage: "Unauthorized",
			});
		}

		res.set("Access-Control-Allow-Origin", process.env.CLIENT_URL);

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

module.exports = {
    login,
    loginCallback,
    logout,
    profile,
}