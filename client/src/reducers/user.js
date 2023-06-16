import { SET_USER } from "../constants/actionTypes";

const initialState = {
	user: {
		displayName: "",
		url: "",
		picture_url: "",
		id: "",
	},
}

const view = (state = initialState, action) => {
	switch (action.type) {
		case SET_USER:
			return {
				...state,
				user: action.payload
			}

		default:
			return state;
	}
};

export default view;