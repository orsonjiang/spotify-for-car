import {
	SET_QUEUE,
	SET_SEARCH_TEXT,
	SET_SEARCH_RESULTS
} from "../constants/action-types";

export const setQueue = (queue) => ({
	type: SET_QUEUE,
	payload: queue
})

export const setSearchText = (text) => ({
	type: SET_SEARCH_TEXT,
	payload: text
})

export const setSearchResults = (results) => ({
	type: SET_SEARCH_RESULTS,
	payload: results
})