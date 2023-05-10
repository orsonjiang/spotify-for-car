import {
	SET_QUEUE,
	SET_ROOM,
	SET_SEARCH_RESULTS,
	SET_ADDED_SONG,
	SET_VIEW,
} from "../constants/action-types";

export const setQueue = (queue) => ({
	type: SET_QUEUE,
	payload: queue
})

export const setRoom = (room) => ({
	type: SET_ROOM,
	payload: room
})

export const setSearchResults = (results) => ({
	type: SET_SEARCH_RESULTS,
	payload: results
})

export const setAddedSong = (trackId) => ({
	type: SET_ADDED_SONG,
	payload: trackId
})

export const setView = (view) => ({
	type: SET_VIEW,
	payload: view
})