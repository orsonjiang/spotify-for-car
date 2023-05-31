import { SET_PLAYLIST, SET_LIBRARY, ADD_PLAYLIST_CACHE } from "../constants/actionTypes";

const initialState = {
	library: [],
	playlist: {
		name: "",
		songs: []
	},
	playlistCache: {

	}
}

const room = (state = initialState, action) => {
	switch (action.type) {
		case SET_PLAYLIST:
			return {
				...state,
				playlist: action.payload
			}
		case SET_LIBRARY:
			return {
				...state,
				library: action.payload
			}
		case ADD_PLAYLIST_CACHE:
			return {
				...state,
				playlistCache: {
					...state.playlistCache,
					[action.payload.id]: action.payload.songs
				}
			}

		default:
			return state;
	}
};

export default room;