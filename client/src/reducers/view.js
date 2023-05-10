import { SET_VIEW } from "../constants/action-types";
import {
	VIEW_HOME,
} from "../constants/view-types";

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