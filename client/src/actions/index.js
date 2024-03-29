import {
	SET_ALERT,
	ADD_TO_DEMO_QUEUE,
	SET_PLAYLIST,
	SET_LIBRARY,
	ADD_PLAYLIST_CACHE,
	SET_QUEUE,
	SET_ROOM,
	SET_SEARCH_RESULTS,
	SET_ADDED_SONG,
	SET_USER,
	SET_VIEW,
	SET_DEMO_PLAYLIST,
} from "../constants/actionTypes";

export const setAlert = (title, message, type) => ({
	type: SET_ALERT,
	payload: {
		title: title,
		message: message,
		type: type,
		isVisible: true,
	}
})

export const clearAlert = () => ({
	type: SET_ALERT,
	payload: {
		title: "",
		message: "",
		type: "",
		isVisible: false,
	}
})

export const addToDemoQueue = (song) => ({
	type: ADD_TO_DEMO_QUEUE,
	payload: song,
})

export const setDemoPlaylist = (playlist) => ({
	type: SET_DEMO_PLAYLIST,
	payload: playlist,
})

export const setPlaylist = (playlist) => ({
	type: SET_PLAYLIST,
	payload: playlist
})

export const setLibrary = (library) => ({
	type: SET_LIBRARY,
	payload: library
})

export const addPlaylistCache = (id, songs) => ({
	type: ADD_PLAYLIST_CACHE,
	payload: {
		id: id,
		songs: songs
	}
})

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

export const setUser = (user) => ({
	type: SET_USER,
	payload: user
})

export const setView = (view) => ({
	type: SET_VIEW,
	payload: view
})