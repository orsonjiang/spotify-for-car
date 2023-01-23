const auth = require("../auth");
const User = require("../models/user-model");
const api = require("../api/spotify");

const getQueue = async (req, res) => {
	User.findOne({ url: req.params.url}, async (err, user) => {
		if (err) {
			return res.status(400);
		}

		const queue = await api.getQueue(user);

		res.status(200).json(queue)
	})
}

module.exports = {
	getQueue,
}