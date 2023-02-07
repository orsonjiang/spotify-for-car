const axios = require('axios');
const qs = require('qs');
const User = require("../models/user-model");
const auth = require("../auth");

const login = (req, res) => {
    const scope = ['user-read-playback-state', 'user-modify-playback-state', 'user-read-private', 'user-read-email'].join(" ");
    const query = qs.stringify({
        response_type: 'code',
        client_id: process.env.CLIENT_ID,
        scope: scope,
        redirect_uri: process.env.CALLBACK_URI,
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
                'redirect_uri': process.env.CALLBACK_URI,
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

        const existingUser = await User.findOne({ id: profileReq.data.id });
        if (existingUser) {
            _id = existingUser._id;
        } else {
            const newUser = new User({
                displayName: profileReq.data.display_name,
                email: profileReq.data.email,
                spotifyId: profileReq.data.id,
                accessToken: credReq.data.access_token,
                refreshToken: credReq.data.refresh_token,
                expiresIn: date,
                url: profileReq.data.id,
            });
            const savedUser = await newUser.save();
            _id = savedUser._id;
        }

        res.cookie("token", auth.signToken(_id), {
            httpOnly: true,
            secure: true,
            sameSite: true,
        })
        res.redirect("http://localhost:5173/profile");

    } catch (err) {
        return res.status(400).json({
            errorMessage: "Unable to verify account with Spotify.",
        });
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
		if (err) {
			res.status(400).json({
				user: null,
				errorMessage: "Unauthorized",
			});
		}

		res.set("Access-Control-Allow-Origin", "http://localhost:5173");

		res.status(200).json({
			user: {
				displayName: user.displayName,
				url: user.url,
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