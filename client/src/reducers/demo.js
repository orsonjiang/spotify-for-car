import { INC_QUEUE_INDEX } from "../constants/actionTypes";

const initialState = {
	queueIndex: 0,
}

const demo = (state = initialState, action) => {
	switch (action.type) {
		case INC_QUEUE_INDEX:
			return {
				...state,
				queueIndex: state.queueIndex+1
			}

		default:
			return state;
	}
};

export default demo;