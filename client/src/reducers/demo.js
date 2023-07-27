import { ADD_TO_DEMO_QUEUE } from "../constants/actionTypes";
import queueData from "../fixtures/queue.json";

const initialState = {
	queueIndex: 0,
	queue: {
		...queueData,
	},
}

const demo = (state = initialState, action) => {
	switch (action.type) {
		case ADD_TO_DEMO_QUEUE:
			return {
				...state,
				queueIndex: state.queueIndex+1,
				queue: {
					...state.queue,
					queue: [
						...state.queue.queue.slice(0, state.queueIndex),
						action.payload,
						...state.queue.queue.slice(state.queueIndex),
					],
				},
			}

		default:
			return state;
	}
};

export default demo;