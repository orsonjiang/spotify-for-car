import { ADD_TO_DEMO_QUEUE } from "../constants/actionTypes";
import queueData from "../fixtures/queue.json";

const initialState = {
	... queueData,
	queueIndex: 0,
}

const demo = (state = initialState, action) => {
	switch (action.type) {
		case ADD_TO_DEMO_QUEUE:
			return {
				...state,
				queue: [
					...state.queue.slice(0, state.queueIndex),
					action.payload,
					...state.queue.slice(state.queueIndex),
				],
				queueIndex: state.queueIndex+1
			}

		default:
			return state;
	}
};

export default demo;