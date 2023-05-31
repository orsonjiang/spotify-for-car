import { SET_VIEW } from "../constants/actionTypes";
import {
	VIEW_HOME,
} from "../constants/viewTypes";

const initialState = {
	globalView: VIEW_HOME,
}

const view = (state = initialState, action) => {
	switch (action.type) {
		case SET_VIEW:
			return {
				...state,
				globalView: action.payload
			}

		default:
			return state;
	}
};

export default view;