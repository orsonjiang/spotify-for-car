const auth = require("../auth");
const User = require("../models/user-model");
const api = require("../api/spotify");

const getQueue = async (req, res) => {
	User.findOne({ url: req.params.url }, async (err, user) => {
		if (err) {
			return res.status(400);
		}

		const queue = await api.getQueue(user);

		res.status(200).json(queue);
	})
}

const search = async (req, res) => {
	User.findOne({ url: req.params.url }, async (err, user) => {
		if (err || !req.query || !req.query.q) {
			return res.status(400);
		}

		const results = await api.search(user, req.query.q);

		res.status(200).json(results);
	})
}

const addToQueue = async (req, res) => {
	User.findOne({ url: req.params.url }, async (err, user) => {
		if (err || !req.query || !req.query.id) {
			return res.status(400);
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

const profile = async (req, res) => {
	User.findOne({ _id: req.userId }, async (err, user) => {
		if (err || !req.query || !req.query.id) {
			return res.status(400);
		}

		if (response) {
			res.status(200).json({
				user: {
					displayName: user.displayName,
					url: user.url,
				},
			});
		} else {
			res.status(400).json({
				user: null,
				errorMessage: "Unauthorized",
			});
		}

		res.end();
	})
}

module.exports = {
	getQueue,
	search,
	addToQueue,
	profile,
}