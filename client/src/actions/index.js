import {
	SET_QUEUE
} from "../constants/action-types";

export const setQueue = (queue) => ({
	type: SET_QUEUE,
	payload: queue
})