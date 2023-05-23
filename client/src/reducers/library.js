import { SET_PLAYLIST, SET_LIBRARY } from "../constants/action-types";

const initialState = {
	library: [],
	playlist: {
		name: "",
		songs: []
	}
}

const room = (state = initialState, action) => {
	switch (action.type) {
		case SET_PLAYLIST:
			return {
				...state,
				playlist: action.payload
			}
		case SET_LIBRARY:
			return {
				...state,
				library: action.payload
			}

		default:
			return state;
	}
};

export default room;