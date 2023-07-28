import { ADD_TO_DEMO_QUEUE, SET_DEMO_PLAYLIST } from "../constants/actionTypes";
import queueData from "../fixtures/queue.json";
import myLibrary from "../fixtures/myLibrary.json";
import playlistCache from "../fixtures/playlistCache.json";

const initialState = {
	queueIndex: 0,
	queue: {
		...queueData,
	},
	library: {
		library: myLibrary.items,
		playlist: {
			name: "",
			songs: []
		},
		playlistCache: playlistCache
	}
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
		case SET_DEMO_PLAYLIST:
			return {
				...state,
				library: {
					...state.library,
					playlist: {
						...action.payload
					}
				}
			}

		default:
			return state;
	}
};

export default demo;