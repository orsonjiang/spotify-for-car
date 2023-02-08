import { SET_SEARCH_TEXT, SET_SEARCH_RESULTS } from "../constants/action-types";

const initialState = {
	text: "",
	results: []
}

const search = (state = initialState, action) => {
	switch (action.type) {
		case SET_SEARCH_TEXT:
			return {
				... state,
				text: action.payload
			}

		case SET_SEARCH_RESULTS:
			return {
				... state,
				text: "",
				results: action.payload
			}

		default:
			return state;
	}
};

export default search;