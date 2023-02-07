import { SET_QUEUE } from "../constants/action-types";
import api from "../api/api";

const queue = (state = [], action) => {
	switch (action.type) {
		case SET_QUEUE:
			return action.payload;

		default:
			return state;
	}
}

export default queue;