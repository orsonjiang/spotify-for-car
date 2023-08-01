import api from "../api/api";
import auth from "../api/authApi";
import store from "../store";
import { setRoom, setQueue, setUser, setLibrary, setAlert, clearAlert } from "../actions";
import { ERROR_VIEW } from "../constants/alertTypes";
import { runAlert } from "./alert";

export const fetchRoomDetails = async (roomId) => {
	try {
		let details = await api.getRoom(roomId);
		store.dispatch(clearAlert());
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
	try {
		let queue = await api.getQueue(roomId);
		store.dispatch(setQueue(queue.data));
	} catch (err) {
		if (!err.response) {
			runAlert("Connection Issue", "There is an issue with our servers. Please sit tight while we rectify the problem.", ERROR_VIEW);
		}
	}
};

export const fetchUser = async () => {
	try {
		const res = await auth.getProfile();
		store.dispatch(setUser(res.data.user));
	} catch (err) {
		if (!err.response) {
			runAlert("Connection Issue", "There is an issue with our servers. Please sit tight while we rectify the problem.", ERROR_VIEW);
		}
	}
};

export const fetchLibrary = async () => {
	try {
		const res = await auth.getLibrary();
		store.dispatch(setLibrary(res.data.items));
	} catch (err) {
		if (!err.response) {
			runAlert("Connection Issue", "There is an issue with our servers. Please sit tight while we rectify the problem.", ERROR_VIEW);
		}
	}
}