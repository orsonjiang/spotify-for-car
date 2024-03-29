import { SET_QUEUE } from "../constants/actionTypes";

const initialState = {
	currentSong: undefined,
	queue: []
};

const queue = (state = initialState, action) => {
	switch (action.type) {
		case SET_QUEUE:
			return action.payload;

		default:
			return state;
	}
};

export default queue;