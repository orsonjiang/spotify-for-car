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

        const profileReq = await axios({
            method: 'get',
            url: 'https://api.spotify.com/v1/me',
            headers: {
                'Authorization': `Bearer ${credReq.data.access_token}`,
            },
        });

        let id = '';

        const existingUser = await User.findOne({ email: profileReq.data.email });
        if (existingUser) {
            id = existingUser._id;
        } else {
            const newUser = new User({
                displayName: profileReq.data.display_name,
                email: profileReq.data.email,
                id: profileReq.data.id,
                refreshToken: credReq.data.refresh_token,
            });
            const savedUser = await newUser.save();
            id = savedUser._id;
        }

        res.cookie("token", auth.signToken(id), {
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

module.exports = {
    login,
    loginCallback,
}