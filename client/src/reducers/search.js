import { SET_SEARCH_RESULTS, SET_ADDED_SONG } from "../constants/action-types";

const initialState = {
	results: [],
	addedSong: "",
}

const search = (state = initialState, action) => {
	switch (action.type) {
		case SET_SEARCH_RESULTS:
			return {
				... state,
				text: "",
				results: action.payload
			}
		case SET_ADDED_SONG:
			return {
				... state,
				results: [],
				addedSong: action.payload
			}

		default:
			return state;
	}
};

export default search;