import api from "../api/api";
import auth from "../api/authApi";
import store from "../store";
import { setRoom, setQueue, setUser, setLibrary, setAlert, clearAlert } from "../actions";
import { LOADING_VIEW } from "../constants/alertTypes";

export const fetchRoomDetails = async (roomId) => {
	let details = await api.getRoom(roomId)
	store.dispatch(clearAlert())
	store.dispatch(setRoom(details.data));
};

export const fetchQueue = async (roomId) => {
	let queue = await api.getQueue(roomId);
	store.dispatch(setQueue(queue.data));
};

export const fetchUser = async () => {
	try {
		const response = await auth.getProfile();
		store.dispatch(setUser(response.data.user));
	} catch {
	}
};

export const fetchLibrary = async () => {
	try {
		const res = await api.getLibrary();
		store.dispatch(setLibrary(res.data.items));
	} catch {

	}
}