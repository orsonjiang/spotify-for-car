import { SET_ROOM } from "../constants/action-types";

const initialState = {
	picture_url: "",
	displayName: "",
	owner_id: "",
}

const room = (state = initialState, action) => {
	switch (action.type) {
		case SET_ROOM:
			return {
				...state,
				...action.payload,
			}

		default:
			return state;
	}
};

export default room;