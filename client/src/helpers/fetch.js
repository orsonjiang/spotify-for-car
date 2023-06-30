import api from "../api/api";
import auth from "../api/authApi";
import store from "../store";
import { setRoom, setQueue, setUser, setLibrary, setAlert, clearAlert } from "../actions";
import { ERROR_VIEW } from "../constants/alertTypes";

export const fetchRoomDetails = async (roomId) => {
	try {
		let details = await api.getRoom(roomId)
		store.dispatch(clearAlert())
		store.dispatch(setRoom(details.data));
	} catch {
		store.dispatch(setAlert("Error Loading Room", "The room does not exist. Try visiting another room.", ERROR_VIEW));
		store.dispatch(setRoom({
			picture_url: null,
			displayName: null,
			owner_id: null,
		}))
	}
};

export const fetchQueue = async (roomId) => {
	let queue = await api.getQueue(roomId);
	store.dispatch(setQueue(queue.data));
};

export const fetchUser = async () => {
	const response = await auth.getProfile();
	store.dispatch(setUser(response.data.user));
};

export const fetchLibrary = async () => {
	const res = await api.getLibrary();
	store.dispatch(setLibrary(res.data.items));
}