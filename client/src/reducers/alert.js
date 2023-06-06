import { SET_ALERT } from "../constants/actionTypes";

const initialState = {
	title: "",
	message: "",
	type: "",
	isVisible: false,
}

const alert = (state = initialState, action) => {
	switch (action.type) {
		case SET_ALERT:
			return {
				...state,
				...action.payload
			}

		default:
			return state;
	}
};

export default alert;