const User = require("../models/user-model");
const api = require("../api/spotify");

require('dotenv').config();

const getRoom = async (req, res) => {
	res.set("Access-Control-Allow-Origin", process.env.CLIENT_URL);
	User.findOne({ url: req.params.url }, async (err, user) => {
		if (err || !user) {
			res.status(400);
			return res.end()
		}

		res.status(200).json({
			displayName: user.displayName,
			picture_url: user.picture_url,
			owner_id: user.spotifyId
		});
	})
}

const getQueue = async (req, res) => {
	res.set("Access-Control-Allow-Origin", process.env.CLIENT_URL);
	User.findOne({ url: req.params.url }, async (err, user) => {
		if (err || !user) {
			res.status(400);
			return res.end()
		}

		const queue = await api.getQueue(user);

		res.status(200).json({
			currentSong: queue.currently_playing,
			queue: queue.queue
		});
	})
}

const search = async (req, res) => {
	res.set("Access-Control-Allow-Origin", process.env.CLIENT_URL);
	User.findOne({ url: req.params.url }, async (err, user) => {
		if (err || !req.query || !req.query.q) {
			res.status(400);
			return res.end()
		}

		const results = await api.search(user, req.query.q);

		res.status(200).json(results);
	})
}

const addToQueue = async (req, res) => {
	res.set("Access-Control-Allow-Origin", process.env.CLIENT_URL);
	User.findOne({ url: req.params.url }, async (err, user) => {
		if (err || !req.query || !req.query.id) {
			res.status(400);
			return res.end();
		}

		const response = await api.addToQueue(user, req.query.id);

		if (response) {
			res.status(200);
		} else {
			res.status(400);
		}

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
	getRoom,
	getQueue,
	search,
	addToQueue,
	getLibrary,
	getPlaylist,
}