import { SET_QUEUE } from "../constants/action-types";

const queue = (state = null, action) => {
	switch (action.type) {
		case SET_QUEUE:
			return action.payload;

		default:
			return state;
	}
}

export default queue;