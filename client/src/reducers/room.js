import { SET_ROOM } from "../constants/action-types";

const initialState = {
	picture_url: "",
	displayName: "",
}

const room = (state = initialState, action) => {
	switch (action.type) {
		case SET_ROOM:
			return {
				...state,
				picture_url: action.payload.picture_url,
				displayName: action.payload.displayName
			}

		default:
			return state;
	}
};

export default room;